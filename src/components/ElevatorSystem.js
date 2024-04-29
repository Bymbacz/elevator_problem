import React from "react";
import Elevator from "./Elevator";
import "./ElevatorSystem.css";

class ElevatorSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            floors: Array.from({length: this.props.maxFloor - this.props.minFloor + 1}, (_, i) => i + this.props.minFloor),
            elevators: Array.from({length: this.props.elevators}, (_, i) => i + 1),
            elevatorStatus: Array.from({length: this.props.elevators}, () => ({
                currentFloor: 0,
                destinationFloor: 0,
            })),
            people: this.props.people,
        }
        this.elevatorRefs = Array.from({length: this.props.elevators}, () => React.createRef());
    }

    step = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (const  [index, elevatorRef] of this.elevatorRefs.entries()) {
            const elevator = elevatorRef.current;
            const currentFloor = elevator.state.currentFloor;
            const queue = elevator.getQueue();
            const people = elevator.getPeople();

            if (queue.length === 0 && people.length === 0) {
                continue;
            }

            // Wrap setState in a new Promise
            await new Promise(resolve => {
                elevator.setState({
                    queue: queue.filter(person => person.pickupFloor !== currentFloor)
                }, resolve);
            });

            await new Promise(resolve => {
                elevator.setState({
                    people: people.filter(person => person.destinationFloor !== currentFloor)
                }, resolve);
            });

            console.log('People', people);
            console.log('NEW People', people.filter(person => person.destinationFloor !== currentFloor));

            console.log('Queue', queue);
            console.log('NEW Queue', queue.filter(person => person.pickupFloor !== currentFloor));
            const peopleToPickup = queue.filter(person => person.pickupFloor === currentFloor);
            for (const person of peopleToPickup) {
               await elevator.pickup(person.pickupFloor, person.destinationFloor);
            }

            const newPeople = elevator.getPeople();
            const newQueue = elevator.getQueue();
            console.log('NEW NEW People', newPeople);
            console.log('NEW NEW Queue', newQueue);

            console.log('Current floors', elevator.getStatus());
            if (elevator.state.destinationFloor === currentFloor) {
                if (newPeople.length > 0) {
                    console.log('IF PEOPLE');
                    const nextDestination = newPeople[0].destinationFloor;
                    console.log('Next destination', nextDestination);
                    await elevator.update(currentFloor, nextDestination);
                } else if (newPeople.length === 0 && newQueue.length > 0) {
                    console.log('IF QUEUE');
                    await elevator.update(currentFloor, newQueue[0].pickupFloor);
                }
            }
            console.log('NEW Current floors', elevator.getStatus());

            // Move the elevator
            if (elevator.state.destinationFloor > currentFloor) {
                elevator.moveUp();
            } else if (elevator.state.destinationFloor < currentFloor) {
                elevator.moveDown();
            }
            console.log(newQueue);
            console.log(' ');
        }
    }

    handleUpdate = async (elevatorId, currentFloor, destinationFloor) => {
        const elevator = this.elevatorRefs[elevatorId - 1].current;
        await new Promise(resolve => {
            elevator.setState({ destinationFloor: destinationFloor, currentFloor: currentFloor}, resolve);
        });

        this.setState(prevState => {
            const newElevatorStatus = [...prevState.elevatorStatus];
            newElevatorStatus[elevatorId - 1].currentFloor = currentFloor;
            newElevatorStatus[elevatorId - 1].destinationFloor = destinationFloor;
            return { elevatorStatus: newElevatorStatus };
        });
    }

    handlePickup = async (elevatorId, pickupFloor, destinationFloor) => {
        const elevator = this.elevatorRefs[elevatorId - 1].current;
        const people = elevator.getPeople();
        const newPeople = [...people, {pickupFloor, destinationFloor}];

        await new Promise(resolve => {
            elevator.setState({ people: newPeople }, resolve);
        });
    }

    handleFloorChange = (elevatorId, newFloor) => {
        this.setState(prevState => {
                const newElevatorStatus = [...prevState.elevatorStatus];
                newElevatorStatus[elevatorId - 1].currentFloor = newFloor;
                return { elevatorStatus: newElevatorStatus };
        });
    }

    status = () => {
        console.log('STATUS!!! ',this.state.elevatorStatus);
    }

    findBestElevator = (pickupFloor, destinationFloor) => {
        let bestElevatorId = 1;
        let smallestQueueSize = Infinity;

        this.elevatorRefs.forEach((elevatorRef, index) => {
            const elevatorId = index + 1;
            const elevatorQueue = elevatorRef.current.getQueue();
            if (elevatorQueue.length < smallestQueueSize) {
                smallestQueueSize = elevatorQueue.length;
                bestElevatorId = elevatorId;
            }
        });

        return bestElevatorId;
    }

    logElevatorQueues = () => {
        this.elevatorRefs.forEach((elevatorRef, index) => {
            const elevatorId = index + 1;
            const elevatorQueue = elevatorRef.current.getQueue();
            console.log(`Elevator ${elevatorId} queue: `, elevatorQueue);
        });
    }

    processPeople = async () => {
        if (this.state.people.length > 0) {
            const [pickupFloor, destinationFloor] = this.state.people[0];

            // Find the best elevator for this person
            const bestElevatorId = this.findBestElevator(pickupFloor, destinationFloor);

            // Add this person to the queue of the best elevator
            const bestElevator = this.elevatorRefs[bestElevatorId - 1].current;
            bestElevator.addPersonToQueue(pickupFloor, destinationFloor);

            // Remove the first person from the people array
            this.setState(prevState => ({
                people: prevState.people.slice(1)
            }), () => {
                this.processPeople();
            });
        } else {
            this.logElevatorQueues();
            while (this.elevatorRefs.some(elevatorRef => {
                const elevator = elevatorRef.current;
                const queue = elevator.getQueue();
                const people = elevator.getPeople();
                return queue.length > 0 || people.length > 0;
            })) {
                console.log(' ');
                console.log('Step');
                await this.step();
                this.status();
            }
        }
    }

    componentDidMount() {
        this.processPeople();
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="grid-container" style={{
                gridTemplateColumns: `.1fr repeat(${this.state.elevators.length}, 1fr)`, // Add an extra 1fr at the beginning
                gridTemplateRows: `repeat(${this.state.floors.length}, 1fr)`
            }}>
                {[...this.state.floors].reverse().map((floor, i) =>
                    <div key={i} style={{
                        gridColumnStart: 1,
                        gridRowStart: i + 1,
                        textAlign: 'center',
                        justifySelf: 'center',
                        alignSelf: 'center',
                        fontStyle: 'bold',
                        fontSize: '1.5em'
                    }}>
                        {floor}
                    </div>
                )}
                {[...this.state.floors].reverse().map((floor, i) =>
                    this.state.elevators.map(elevatorId =>
                        floor === 0 &&
                        <Elevator
                            ref={this.elevatorRefs[elevatorId - 1]}
                            key={elevatorId}
                            id={elevatorId}
                            floor={this.state.elevatorStatus[elevatorId - 1].currentFloor}
                            onFloorChange={this.handleFloorChange}
                            minFloor={this.props.minFloor}
                            maxFloor={this.props.maxFloor}
                            update={this.handleUpdate}
                            pickup={this.handlePickup}
                            column={elevatorId + 1}
                        />
                    )
                )}
            </div>
        );
    }
}

export default ElevatorSystem;