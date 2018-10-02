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

console.log("=========== REPORT ===========")

const totalTime = Timer.getGlobal()
console.log(`Time of execution: ${totalTime}\n`)

const queues = Timer.getQueues()

for (let key in queues) {
    const queue = queues[key]
    console.log(`probability for queue ${key}`)

    for (let i in queue) {
        const time = queue[i].toFixed(2)
        const prob = (queue[i] / totalTime * 100).toFixed(2)
        console.log(`${i} => ${time} - ${prob}%`)
    }
}