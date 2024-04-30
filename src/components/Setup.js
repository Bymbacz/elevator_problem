import React from 'react';
import ElevatorSystem from './ElevatorSystem';

class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elevators: 0,
            floors: 0,
            setupComplete: false,
            people: [[0,1],[0,2],[0,3],[1,3],[3,2],[2,1]]
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ setupComplete: true });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: parseInt(event.target.value) });
    }

    render() {
        if (this.state.setupComplete) {
            return <ElevatorSystem elevators={this.state.elevators} minFloor={0} maxFloor={this.state.floors-1} people={this.state.people} />;
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Number of elevators:
                        <input type="number" name="elevators" min="0" max="16" onChange={this.handleChange} />
                    </label>
                    <label>
                        Number of floors:
                        <input type="number" name="floors" min="1" max="10" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }
}

export default Setup;