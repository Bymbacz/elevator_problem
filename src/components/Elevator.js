import React from 'react';
import './Elevator.css';

class Elevator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id, // Add this line
            currentFloor: props.floor,
            destinationFloor: props.floor,
            queue: [], // Each person is an object {id: uniqueId, desiredFloor: floorNumber}
            maxFloor: props.maxFloor,
            minFloor: props.minFloor,
            onFloorChange: props.onFloorChange,
            column: props.column,
            people: [],
        };
    }

    addPersonToQueue = (pickupFloor, destinationFloor) => {
        this.setState(prevState => ({
            queue: [...prevState.queue, {pickupFloor, destinationFloor}]
        }));
    }

    getQueue = () => {
        return this.state.queue;
    }

    getPeople = () => {
        return this.state.people;
    }

    getStatus = () => {
        return {
            currentFloor: this.state.currentFloor,
            destinationFloor: this.state.destinationFloor
        };
    }

    pickup = (pickupFloor, destinationFloor) => {
        this.setState(prevState => ({
            people: [...prevState.people, {pickupFloor, destinationFloor}]
        }));
    }

    update = (currentFloor, destinationFloor) => {
        this.props.update(this.state.id, currentFloor, destinationFloor);
    }

    moveUp = () => {
        if (this.state.currentFloor < this.props.maxFloor) {
            this.setState(
                prevState => ({
                    currentFloor: prevState.currentFloor + 1
                }),
                () => {
                    this.props.onFloorChange(this.state.id, this.state.currentFloor);
                }
            );
        }
    }

    moveDown = () => {
        if (this.state.currentFloor > this.props.minFloor) {
            this.setState(
                prevState => ({
                    currentFloor: prevState.currentFloor - 1
                }),
                () => {
                    this.props.onFloorChange(this.state.id, this.state.currentFloor);
                }
            );
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        const elevatorElements = document.querySelectorAll(`.elevator`);
        elevatorElements.forEach(elevatorElement => {
            const height = elevatorElement.offsetHeight;
            elevatorElement.style.width = `${height / 2}px`;
        });
    }


    render() {
        return (
            <div className={`elevator elevator-${this.state.id} ${this.props.className}`} style={{gridRowStart: this.props.maxFloor - this.state.currentFloor + 1, gridRowEnd: this.props.maxFloor - this.state.currentFloor + 2, gridColumnStart: this.props.column}}>
            </div>
        );
    }
}

export default Elevator;