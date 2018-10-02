import {E} from "./events"

export class Scheduler {
    private events: E[] = []

    constructor(events: E | E[]) {
        this.schedule(events)
    }

    next(): E {
        return this.events.shift()
    }

    schedule(events: E | E[]) {
        if (! (events instanceof Array)) {
            events = [events]
        }

        for (let event of events) {
            this.events.push(event)
        }

        this.sort()
    }

    sort() {
        this.events.sort((a, b) => a.time > b.time ? 1 : -1)
    }

    empty() {
        return this.events.length === 0
    }
}