import Timer from "./timer"
import {Simulator} from "./simulator"
import * as config from "./configs/example1.json"

const sim = new Simulator(
    (<any>config).queues,
    (<any>config).initial,
    (<any>config).randoms
)

for (let i=1; ! sim.ended(); i++) {
    sim.step(i)
}

console.log(Timer.getGlobal())
console.log(Timer.getQueues())