import React from 'react';
import ElevatorSystem from './ElevatorSystem';

class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elevators: 0,
            floors: 0,
            setupComplete: false,
            people: [],
            pickupFloor: 0,
            destinationFloor: 0
        };
    }

    // Function to handle the form submission
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ setupComplete: true });
    }

    // Function to handle the form input change
    handleChange = (event) => {
        this.setState({ [event.target.name]: parseInt(event.target.value) });
    }

    // Function to handle the "Add person" button click
    handleAddPerson = () => {
        this.setState(prevState => ({
            people: [...prevState.people, [prevState.pickupFloor, prevState.destinationFloor]]
        }));
    }

    // Render the ElevatorSystem component if the setup is complete, otherwise render the setup form
    render() {
        if (this.state.setupComplete) {
            return <ElevatorSystem elevators={this.state.elevators} minFloor={0} maxFloor={this.state.floors-1} people={this.state.people} />;
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Number of elevators:
                        <input type="number" name="elevators" min="0" max="16" onChange={this.handleChange}/>
                    </label>
                    <label>
                        Number of floors:
                        <input type="number" name="floors" min="1" max="10" onChange={this.handleChange}/>
                    </label>
                    <label>
                        Pickup floor:
                        <input type="number" name="pickupFloor" min="0" max={this.state.floors - 1}
                               onChange={this.handleChange}/>
                    </label>
                    <label>
                        Destination floor:
                        <input type="number" name="destinationFloor" min="0" max={this.state.floors - 1}
                               onChange={this.handleChange}/>
                    </label>
                    <button type="button" onClick={this.handleAddPerson}>Add person</button>
                    <input type="submit" value="Submit"/>
                </form>
            );
        }
    }
}

export default Setup;