import TimeLogger from "./timer"
import {Simulator} from "./simulator"
import * as config from "./configs/example2.json"

const sim = new Simulator(
    (<any>config).queues,
    (<any>config).initial,
    (<any>config).randoms
)

for (let i=1; ! sim.ended(); i++) {
    sim.step(i)
}

console.log("=========== REPORT ===========")

const totalTime = TimeLogger.getTotal()
console.log(`Execution time: ${totalTime.toFixed(4)}\n`)

const queues = TimeLogger.getQueues()

for (let key in queues) {
    const queue = queues[key]
    console.log(`Probability for queue ${key}`)

    for (let i in queue) {
        const time = queue[i].toFixed(2)
        const prob = (queue[i] / totalTime * 100).toFixed(2)
        console.log(`${i} => ${time} - ${prob}%`)
    }

    console.log()
}