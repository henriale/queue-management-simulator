import {Queue} from "./queue";
import {PseudoRandom} from "./random";
import Timer from "./timer";

export abstract class E {
    protected origin: Queue
    protected destination: Queue
    time: number

    constructor(time: number, origin: Queue, destination?: Queue) {
        this.time = time
        this.origin = origin
        this.destination = destination
    }

    protected clock() {
        Timer.increase(this.origin.getName(), this.time, this.origin.getSize())
    }

    outOfRandoms(): boolean {
        if (PseudoRandom.numbers.length < 2) {
            return true
        }

        return false
    }

    abstract execute(queues: Queue[]): E[]
}

class ArrivalFactory {
    static create(queue: Queue): Arrival {
        const input = queue.getInput()
        const random = PseudoRandom.gen(input.from, input.to)
        const time = Timer.getGlobal() + random

        console.log(`${queue.getName()}: Scheduling an arrival to ${time.toFixed(4)}`)

        return new Arrival(time, queue)
    }
}

class LeavingFactory {
    static create(queue: Queue): Leaving {
        const output = queue.getOutput()
        const random = PseudoRandom.gen(output.from, output.to)
        const time = Timer.getGlobal() + random

        console.log(`${queue.getName()}: Scheduling a leaving to ${time.toFixed(4)}`)

        return new Leaving(time, queue)
    }
}


class ForwardFactory {
    static create(queue: Queue, queues: Queue[], destinationName: string): Forward | Leaving {
        if (! destinationName) {
            return LeavingFactory.create(queue)
        }

        const destination = destinationFromName(queues, destinationName);

        const output = queue.getOutput()
        const random = PseudoRandom.gen(output.from, output.to)
        const time = Timer.getGlobal() + random

        console.log(`${queue.getName()}: Scheduling a forward to ${time.toFixed(4)}`)

        return new Forward(time, queue, destination)
    }
}

export class Arrival extends E {
    execute(queues: Queue[]): E[] {
        const origin: Queue = this.origin

        this.clock();
        console.log(`Arrival at ${Timer.getGlobal().toFixed(4)} in ${origin.getName()}`)

        if (this.outOfRandoms()) {
            return []
        }


        if (origin.isFull()) {
            return [ArrivalFactory.create(origin)]
        }

        origin.enqueue()

        if (! origin.isThereIdleServers()) {
            return [
                ArrivalFactory.create(origin)
            ]
        }

        const probability = PseudoRandom.gen(0, 1)
        let destination = origin.getDestination(0)

        if (destination.probability <= probability) {
            destination = origin.getDestination(1)
        }

        return [
            ForwardFactory.create(origin, queues, destination.name),
            ArrivalFactory.create(origin)
        ]
    }
}

export class Leaving extends E {
    execute(queues: Queue[]): E[] {
        const origin: Queue = this.origin

        this.clock();
        console.log(`Leaving at ${Timer.getGlobal().toFixed(4)} in ${origin.getName()}`)

        if (this.outOfRandoms()) {
            return []
        }

        origin.dequeue()

        if (! origin.isAllServersBusy()) {
            return []
        }

        return [LeavingFactory.create(origin)]
    }
}

export class Forward extends E {
    execute(queues: Queue[]): E[] {
        const origin: Queue = this.origin

        this.clock();
        console.log(`Forward at ${Timer.getGlobal().toFixed(4)} in ${origin.getName()}`)

        if (this.outOfRandoms()) {
            return []
        }

        const events = []
        origin.dequeue()

        if (origin.isAllServersBusy()) {
            const probability = PseudoRandom.gen(0, 1)
            let destination = origin.getDestination(0)

            if (destination.probability <= probability) {
                destination = origin.getDestination(1)
            }

            console.log(`   -> to: ${destination.name}`)

            events.push(ForwardFactory.create(origin, queues, destination.name))
        }

        const destination = this.destination
        destination.enqueue()

        console.log(`   -> to: ${destination.getName()}`)

        if (! destination.isThereIdleServers()) {
            return []
        }

        events.push(LeavingFactory.create(destination))

        return events


        // const probability = PseudoRandom.gen(0, 1)
        // let destination = origin.getDestination(0)
        //
        // if (destination.probability <= probability) {
        //     destination = origin.getDestination(1)
        // }
        //
        // return [
        //     ForwardFactory.create(origin, queues, destination.name),
        //     ArrivalFactory.create(origin)
        // ]
    }
}

function destinationFromName(queues: Queue[], destinationName: string): Queue {
    return queues.filter(function (q) {
        return q.getName() === destinationName
    })[0]
}