import {Queue} from "./queue"
import {Arrival} from "./events"
import {Scheduler} from "./scheduler"
import {RandomFactory} from "./random"

export class Simulator {
    private queues: Queue[]
    private scheduler: Scheduler

    constructor(queues, initials, randoms) {
        this.queues = this.parseQueues(queues)
        this.scheduler = new Scheduler(this.parseFirstArrivals(initials))
        RandomFactory.create(randoms)
    }

    step(i) {
        console.log(`Round: ${i}`)

        const event = this.scheduler.next()
        const events = event.execute(this.queues)
        this.scheduler.schedule(events)

        console.log()
    }

    ended() {
        return this.scheduler.empty()
    }

    private parseFirstArrivals(arrivals: {time: number, queue: string}[]): Arrival[] {
        const parsed = []

        for (let arrival of arrivals) {
            let queue = this.queues.filter((q) => {
                return q.getName() === arrival.queue
            })[0]
            parsed.push(new Arrival(arrival.time, queue))
        }

        return parsed
    }

    private parseQueues(queues): Queue[] {
        let parsed = []
        for (let queue of queues) {
            parsed.push(new Queue(
                queue.servers,
                queue.capacity || Infinity,
                queue.name,
                queue.wires.arrivals,
                queue.wires.leavings,
                queue.wires.destinations
            ))
        }

        return parsed
    }
}
