import React from "react";
import Elevator from "./Elevator";
import "./ElevatorSystem.css";
import elevator from "./Elevator";

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

    // Function to add a person to the people array in Elevator
    pickup = async (elevatorId, destinationFloor) => {
        const elevator = this.elevatorRefs[elevatorId - 1].current;
        return new Promise(resolve => {
            elevator.setState({
                people: [...elevator.state.people, {pickupFloor: elevator.getCurrentFloor(), destinationFloor: destinationFloor}]
            }, resolve)
        });
    }

    // Function to update the current and destination floor of an elevator
    update = async (elevatorID, currentFloor, destinationFloor) => {
        const elevator = this.elevatorRefs[elevatorID - 1].current;

        if (currentFloor > this.props.maxFloor || currentFloor < this.props.minFloor) {
            alert('Used update function with invalid current floor -> out of range');
            return -1;
        }

        if (destinationFloor > this.props.maxFloor || destinationFloor < this.props.minFloor) {
            alert('Used update function with invalid destination floor -> out of range');
            return -1;
        }

        this.setState(prevState => {
            const updatedElevatorStatus = [...prevState.elevatorStatus];
            updatedElevatorStatus[elevatorID - 1] = { currentFloor, destinationFloor };
            return { elevatorStatus: updatedElevatorStatus };
        });

        return new Promise(resolve => {
            elevator.setState({
                currentFloor: currentFloor,
                destinationFloor: destinationFloor
            }, resolve);
        });
    }

    // Function to remove all people from the people array in Elevator when they reach their destination
    dropOff = async (elevatorId, currentFloor) => {
        const elevator = this.elevatorRefs[elevatorId - 1].current;
        return new Promise(resolve => {
            elevator.setState({
                people: elevator.getPeople().filter(person => person.destinationFloor !== currentFloor)
            }, resolve);
        });
    }

    // Function that returns the status of the elevators
    status = () => {
        return this.state.elevatorStatus;
    }

    // Function to delete the first person from the people/queue array in Elevator if they have an invalid destination floor
    deleteValidPerson = async (elevatorId) => {
        const elevator = this.elevatorRefs[elevatorId - 1].current;
        if (elevator.getPeople()[0].destinationFloor > this.props.maxFloor || elevator.getPeople()[0].destinationFloor < this.props.minFloor) {
            return new Promise(resolve => {
                elevator.setState({
                    people: elevator.getPeople().slice(1)
                }, resolve);
            });
        }
        if (elevator.getQueue()[0].pickupFloor > this.props.maxFloor || elevator.getQueue()[0].pickupFloor < this.props.minFloor) {
            return new Promise(resolve => {
                elevator.setState({
                    queue: elevator.getQueue().slice(1)
                }, resolve);
            });
        }
    }

    // Function to simulate a step in the elevator system
    step = async () => {
        for (const  [index, elevatorRef] of this.elevatorRefs.entries()) {
            const elevator = elevatorRef.current;
            const queue = elevator.getQueue();
            const people = elevator.getPeople();

            // Skip if there are no people or queue
            if (queue.length === 0 && people.length === 0) {
                continue;
            }

            // Pickup people
            const peopleToPickup = queue.filter(person => person.pickupFloor === elevator.getCurrentFloor());
            for (const person of peopleToPickup) {
                await this.pickup(elevator.getId(), person.destinationFloor)
            }

            // Delete picked up people from the queue
            await new Promise(resolve => {
                elevator.setState({
                    queue: queue.filter(person => person.pickupFloor !== elevator.getCurrentFloor())
                }, resolve);
            });

            // Drop off people
            await this.dropOff(elevator.getId(), elevator.getCurrentFloor());

            // Change destination floor if needed
            if (elevator.getDestinationFloor() === elevator.getCurrentFloor()) {
                if (elevator.getPeople().length > 0) {
                    const error = await this.update(elevator.getId(), elevator.getCurrentFloor(), elevator.getPeople()[0].destinationFloor);
                    if (error === -1) {
                        await this.deleteValidPerson(elevator.getId());
                    }
                } else if (elevator.getPeople().length === 0 && elevator.getQueue().length > 0) {
                    const error = await this.update(elevator.getId(), elevator.getCurrentFloor(), elevator.getQueue()[0].pickupFloor);
                    if (error === -1) {
                        await this.deleteValidPerson(elevator.getId());
                    }
                }
            }

            // Move the elevator
            if (elevator.getDestinationFloor() > elevator.getCurrentFloor()) {
                await this.update(elevator.getId(), elevator.getCurrentFloor() + 1, elevator.getDestinationFloor());
            } else if (elevator.getDestinationFloor() < elevator.getCurrentFloor()) {
                await this.update(elevator.getId(), elevator.getCurrentFloor() - 1, elevator.getDestinationFloor());
            }
        }
    }

    // Function to find the best elevator for a person
    findBestElevator = (pickupFloor, destinationFloor) => {
        let bestElevatorId = 1;
        let smallestQueueSize = Infinity;

        // Find the elevator with the smallest queue
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

    // Function to assign people from input to Elevators
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

            // Run the simulation until all elevators are empty
            while (this.elevatorRefs.some(elevatorRef => {
                const elevator = elevatorRef.current;
                const queue = elevator.getQueue();
                const people = elevator.getPeople();
                return queue.length > 0 || people.length > 0;
            })) {
                // Wait for 1 second before running the next step
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Run the next step
                await this.step();

                // Display the status of the elevators
                console.log(this.status());
            }
        }
    }

    // Run the processPeople function when the component mounts
    componentDidMount() {
        this.processPeople();
    }

    // Render the ElevatorSystem component
    render() {
        return (
            <div className="grid-container" style={{
                gridTemplateColumns: `.1fr repeat(${this.state.elevators.length}, 1fr)`, // Add an extra 1fr at the beginning
                gridTemplateRows: `repeat(${this.state.floors.length}, 1fr)`
            }}>
                {[...this.state.floors].reverse().map((floor, i) =>
                    <div key={i} className={'grid-floor'} style={{
                        gridColumnStart: 1,
                        gridRowStart: i + 1,
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
                            column={elevatorId + 1}
                            maxFloor={this.props.maxFloor}
                            minFloor={this.props.minFloor}
                        />
                    )
                )}
            </div>
        );
    }
}

export default ElevatorSystem;