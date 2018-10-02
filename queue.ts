export class Queue {
    private capacity: number
    private servers: number
    private size: number
    private name: string
    private input: {from: number, to: number}
    private output: {from: number, to: number}
    private destinations: {probability: number, name: string}[]

    constructor(
        servers: number,
        capacity: number,
        name: string,
        input: {from: number, to: number} | undefined,
        output: {from: number, to: number},
        detinations: {probability: number, name: string}[]
    ) {
        this.capacity = capacity - servers
        this.destinations = detinations
        this.servers = servers
        this.output = output
        this.input = input
        this.name = name
        this.size = 0
    }

    enqueue() {
        this.size += 1
    }

    dequeue() {
        this.size -= 1
    }

    isFull(): boolean {
        return this.size === (this.capacity + this.servers)
    }

    isAllServersBusy() {
        return this.size >= this.servers
    }

    isThereIdleServers() {
        return this.size <= this.servers
    }

    hasArrival(): boolean {
        return !! this.input
    }

    empty() {
        return this.size < this.servers
    }

    getName() {
        return this.name
    }

    getSize() {
        return this.size
    }

    getInput() {
        return this.input
    }

    getOutput() {
        return this.output
    }

    getDestinations() {
        return this.destinations
    }

    getDestination(index: number) {
        return this.destinations[index]
    }
}


