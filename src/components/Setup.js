import React from 'react';
import ElevatorSystem from './ElevatorSystem';
import './Setup.css';

class PersonInput extends React.Component {
    render() {
        return (
            <div className="setup-div">
                <label>
                    Pickup floor:
                    <input type="number" name="pickupFloor" min="0" max={this.props.floors - 1} value={this.props.pickupFloor} onChange={this.props.handleChange}/>
                </label>
                <label>
                    Destination floor:
                    <input type="number" name="destinationFloor" min="0" max={this.props.floors - 1} value={this.props.destinationFloor} onChange={this.props.handleChange}/>
                </label>
            </div>
        );
    }
}

class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elevators: 0,
            floors: 0,
            setupComplete: false,
            people: [{ pickupFloor: 0, destinationFloor: 0 }],
        };
    }

    // Function to handle the form submission
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ setupComplete: true });
    }

    // Function to handle the form input change
    handleChange = (index, event) => {
        const people = [...this.state.people];
        people[index][event.target.name] = parseInt(event.target.value);
        this.setState({ people });
    }

    // Function to handle the "Add person" button click
    handleAddPerson = () => {
        this.setState(prevState => ({
            people: [...prevState.people, { pickupFloor: 0, destinationFloor: 0 }]
        }));
    }

    // Function to check if all fields have values
    isFormValid = () => {
        return this.state.elevators > 0 && this.state.floors > 1 && this.state.people.every(person => person.pickupFloor >= 0 && person.destinationFloor >= 0);
    }

    // Render the ElevatorSystem component if the setup is complete, otherwise render the setup form
    render() {
        if (this.state.setupComplete) {
            return <ElevatorSystem elevators={this.state.elevators} minFloor={0} maxFloor={this.state.floors-1} people={this.state.people.map(person => [person.pickupFloor, person.destinationFloor])} />;
        } else {
            return (
                <div className="setup">
                    <form onSubmit={this.handleSubmit} className="setup-form">
                        <h1>Elevator System Setup</h1>
                        <div className="setup-div">
                            <label>
                                Number of elevators:
                                <input type="number" name="elevators" min="0" max="16"
                                       onChange={event => this.setState({elevators: parseInt(event.target.value)})}/>
                            </label>
                            <label>
                                Number of floors:
                                <input type="number" name="floors" min="1" max="10"
                                       onChange={event => this.setState({floors: parseInt(event.target.value)})}/>
                            </label>
                        </div>
                        {this.state.people.map((person, index) => (
                            <PersonInput key={index} floors={this.state.floors} pickupFloor={person.pickupFloor}
                                         destinationFloor={person.destinationFloor}
                                         handleChange={event => this.handleChange(index, event)}/>
                        ))}
                        <br/>
                        <div className="setup-div">
                            <button type="button" onClick={this.handleAddPerson}>Add person</button>
                            <input type="submit" value="Submit" disabled={!this.isFormValid()}/>
                        </div>
                    </form>
                </div>
        );
        }
        }
}

export default Setup;