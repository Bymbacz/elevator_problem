# Elevator System Simulator

## Description
Project created with React to simulate an elevator system. After providing input data, the system will simulate the elevator's movements.

## Starting the project locally
To start the project, you need to have Node.js installed. If you don't have it, you can download it [here](https://nodejs.org/en/).

After installing Node.js, you can clone the project and run the following commands in the project's root directory:

### `npm install`

This command will install all the dependencies needed to run the project.\
**It is important to note that this command must be run before starting the project.**

### `npm start`

Runs the app on localhost.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## Starting the project [online]
The project is also available online on GitHub pages. You can access it [here](https://bymbacz.github.io/elevator_problem/).

## Input data
After starting the project, you will be asked to provide this input data:
- ***Number of floors*** - the number of floors in the building (Note: the floors start from `0`, so if you enter `10`, the floors will be from `0` to `9`). The min value is set to `1` and the max value is set to `10` for sake of display. of course, you can change it in the code, but the visualization may not be as good as it is now
- ***Number of elevators*** - the number of elevators in the building. The min value is set to `1` and the max value is set to `16`
- ***Pickup floor*** - the floor from which the passenger wants to go
- ***Destination floor*** - the floor to which the passenger wants to go

On the bottom you will find 2 buttons:
- ***Add person*** - adds another `Pickup floor` and `Destination floor` to the list of requests
- ***Start simulation*** - starts the simulation

## Simulation
After providing the input data and starting the simulation, you will see the elevator system in action. The system will simulate the elevator's movements and show you the current position of Elevators.

## Algorithm
When the simulation starts, the system assigns passengers from input data to the elevators. 
The system searches if one of the elevators has a passenger with the same or smaller pickup floor than the passenger from the input data and the same or bigger destination floor (or in the other way, if person is going downwards). 
If it finds one, it assigns the passenger to this elevator. 
If it doesn't find any, it assigns the passenger to the elevator with the smallest number of passengers.

The movement algorithm delivers passengers in the same order as they were added to the system.\
The elevator will also pick up passengers from the floors that are on the way to the destination floor.\
The elevator will also drop off passengers on the floors that are on the way to the destination floor.

Then we use `step()` function to simulate the elevator's movements. It works as follows:
- use `pickup()` function to pick up passengers from the current floor (if there are any assigned to this elevator)
- use `dropoff()` function to drop off passengers on the destination floor (if there are any currently in the elevator)
- change the elevator's direction if it reaches the destination floor
- use `update()` to move the elevator to the next floor

The simulation ends when all passengers are delivered to their destination floors.