import {Queue} from "./queue";
import {PseudoRandom} from "./random";
import Timer from "./timer";

export abstract class E {
    protected queue: Queue
    time: number

    constructor(time: number, queue: Queue) {
        this.time = time
        this.queue = queue
    }

    protected clock() {
        Timer.increase(this.queue.getName(), this.time, this.queue.getSize())
    }

    outOfRandoms(): boolean {
        if (PseudoRandom.numbers.length < 2) {
            return true
        }

        return false
    }

    abstract execute(): E[]
}

class ArrivalFactory {
    static create(queue: Queue): Arrival {
        const input = queue.getInput()
        const random = PseudoRandom.gen(input.from, input.to)
        const time = Timer.getGlobal() + random

        console.log(`Scheduling an arrival to ${time}`)

        return new Arrival(time, queue)
    }
}

class LeavingFactory {
    static create(queue: Queue): Leaving {
        const output = queue.getOutput()
        const random = PseudoRandom.gen(output.from, output.to)
        const time = Timer.getGlobal() + random

        console.log(`Scheduling a leaving to ${time}`)

        return new Leaving(time, queue)
    }
}

export class Arrival extends E {
    execute(): E[] {
        this.clock();
        console.log(`Arrival at ${Timer.getGlobal()}`)

        if (this.outOfRandoms()) {
            return []
        }

        const queue: Queue = this.queue

        if (queue.isFull()) {
            return [ArrivalFactory.create(queue)]
        }

        queue.enqueue()

        if (queue.isThereIdleServers()) {
            return [
                LeavingFactory.create(queue),
                ArrivalFactory.create(queue)
            ]
        }

        return [
            ArrivalFactory.create(queue)
        ]
    }
}

export class Leaving extends E {
    execute(): E[] {
        this.clock();
        console.log(`Leaving at ${Timer.getGlobal()}`)

        if (this.outOfRandoms()) {
            return []
        }

        const queue = this.queue
        queue.dequeue()

        if (! queue.isAllServersBusy()) {
            return []
        }

        return [LeavingFactory.create(queue)]
    }
}