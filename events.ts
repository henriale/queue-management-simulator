import {Queue} from "./queue";
import {PseudoRandom} from "./random";
import TimeLogger from "./timer";

export abstract class E {
    protected queue: Queue
    protected destination: Queue
    protected time: number

    constructor(time: number, queue: Queue, destination?: Queue) {
        this.time = time
        this.queue = queue
        this.destination = destination
    }

    protected clock() {
        TimeLogger.increase(this.queue.getName(), this.getTime(), this.queue.getSize())
    }

    public getTime() {
        return this.time
    }

    abstract execute(queues: Queue[]): E[]
}

class ArrivalFactory {
    static create(queue: Queue): Arrival {
        const input = queue.getInput()
        const random = PseudoRandom.gen(input.from, input.to)
        const time = TimeLogger.getTotal() + random

        console.log(`${queue.getName()}: Scheduling an arrival to ${time.toFixed(4)}`)

        return new Arrival(time, queue)
    }
}

class LeavingFactory {
    static create(queue: Queue, queues: Queue[], destinationName: string): Leaving {
        if (! destinationName) {
            return ForwentFactory.create(queue)
        }

        const destination = destinationFromName(queues, destinationName)

        return ForwardFactory.create(queue, destination)
    }
}

class ForwentFactory {
    static create(queue: Queue): Forwent {
        const output = queue.getOutput()
        const random = PseudoRandom.gen(output.from, output.to)
        const time = TimeLogger.getTotal() + random

        console.log(`${queue.getName()}: Scheduling a leaving to ${time.toFixed(4)}`)

        return new Forwent(time, queue)
    }
}

class ForwardFactory {
    static create(queue: Queue, destination: Queue): Forward {
        const output = queue.getOutput()
        const random = PseudoRandom.gen(output.from, output.to)
        const time = TimeLogger.getTotal() + random

        console.log(`${queue.getName()}: Scheduling a forward to ${time.toFixed(4)}`)

        return new Forward(time, queue, destination)
    }
}

abstract class Leaving extends E {}

export class Arrival extends E {
    execute(queues: Queue[]): E[] {
        const queue: Queue = this.queue

        this.clock();
        console.log(`Arrival at ${TimeLogger.getTotal().toFixed(4)} in ${queue.getName()}`)

        if (PseudoRandom.outOfNumbers()) {
            return []
        }


        if (queue.isFull()) {
            return [ArrivalFactory.create(queue)]
        }

        queue.enqueue()

        if (! queue.isThereIdleServers()) {
            return [
                ArrivalFactory.create(queue)
            ]
        }

        const probability = PseudoRandom.gen(0, 1)
        let destination = queue.getDestination(0)

        if (destination.probability <= probability) {
            destination = queue.getDestination(1)
        }

        return [
            LeavingFactory.create(queue, queues, destination.name),
            ArrivalFactory.create(queue)
        ]
    }
}

export class Forwent extends Leaving {
    execute(queues: Queue[]): E[] {
        const queue: Queue = this.queue

        this.clock();
        console.log(`Leaving at ${TimeLogger.getTotal().toFixed(4)} in ${queue.getName()}`)

        if (PseudoRandom.outOfNumbers()) {
            return []
        }

        queue.dequeue()

        if (! queue.isAllServersBusy()) {
            return []
        }

        return [ForwentFactory.create(queue)]
    }
}

export class Forward extends Leaving {
    execute(queues: Queue[]): E[] {
        const queue: Queue = this.queue

        this.clock();
        console.log(`Forward at ${TimeLogger.getTotal().toFixed(4)} in ${queue.getName()}`)

        if (PseudoRandom.outOfNumbers()) {
            return []
        }

        const events = []
        queue.dequeue()

        if (queue.isAllServersBusy()) {
            const probability = PseudoRandom.gen(0, 1)
            let destination = queue.getDestination(0)

            if (destination.probability <= probability) {
                destination = queue.getDestination(1)
            }

            console.log(`   -> to: ${destination.name}`)

            events.push(LeavingFactory.create(queue, queues, destination.name))
        }

        const destination = this.destination
        destination.enqueue()

        console.log(`   -> to: ${destination.getName()}`)

        if (! destination.isThereIdleServers()) {
            return []
        }

        events.push(ForwentFactory.create(destination))

        return events
    }
}

function destinationFromName(queues: Queue[], destinationName: string): Queue {
    return queues.filter(function (q) {
        return q.getName() === destinationName
    })[0]
}