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
            column: props.column,
            people: [],
        };
    }

    // Function to add a person to the queue array in Elevator
    addPersonToQueue = (pickupFloor, destinationFloor) => {
        this.setState(prevState => ({
            queue: [...prevState.queue, {pickupFloor, destinationFloor}]
        }));
    }

    // Function that returns the queue array in Elevator
    getQueue = () => {
        return this.state.queue;
    }

    // Function that returns the people array in Elevator
    getPeople = () => {
        return this.state.people;
    }

    // Function that returns the id of the elevator
    getId = () => {
        return this.state.id;
    }

    // Function that returns the current floor of the elevator
    getCurrentFloor = () => {
        return this.state.currentFloor;
    }

    // Function that returns the destination floor of the elevator
    getDestinationFloor = () => {
        return this.state.destinationFloor;
    }

    // Run updateDimensions when the component mounts and when the window is resized
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    // Remove the event listener when the component unmounts
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    // Function to update the width of the elevator to be half of its height
    updateDimensions = () => {
        const elevatorElements = document.querySelectorAll(`.elevator`);
        elevatorElements.forEach(elevatorElement => {
            const height = elevatorElement.offsetHeight;
            elevatorElement.style.width = `${height / 2}px`;
        });
    }

    // Render the Elevator component
    render() {
        return (
            <div className={`elevator elevator-${this.state.id} ${this.props.className}`} style={{gridRowStart: this.props.maxFloor - this.state.currentFloor + 1, gridRowEnd: this.props.maxFloor - this.state.currentFloor + 2, gridColumnStart: this.props.column}}>
            </div>
        );
    }
}

export default Elevator;