## Running
`node app.js`

in case you don't have node installed
``brew update && brew install node``
## Configuration
You can create a new configuration in `configs` folder.
The config file has the following structure:

- `queue`: An array of queues and its connections
    - `name`: Yes, the name
    - `servers`: The number servers
    - `capacity`: The capacity **(not mandatory)**
    - `wires`: Information about the queue connections
        - `arrivals`: Range of time for arrivals
        - `leavings`: Range of time for leavings
        - `destinations`: Array of destinations and probabilities of leavings
            - `probability`: number from 0 to 1
            - `name`: **(not mandatory)**
- `initial`: This is an array of events that will be created along with the scheduler
    - `queue`: The queue name
    - `time`: The time the event will run
- `randoms`: It`s a simple array with all randoms 


