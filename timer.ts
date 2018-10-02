export default class Timer {
    private static global = 0
    /*private*/ static queues = {}

    static increase(queueName, amount, index) {
        const queue = Timer.queues[queueName] = Timer.queues[queueName] || []
        const delta = amount - this.global
        queue[index] = (queue[index] || 0) + delta

        console.log(`[Global time: ${this.global} | Actual time: ${amount}]`)

        this.global += delta
    }

    static getGlobal() {
        return Timer.global
    }

    static getQueues() {
        return Timer.queues
    }
}