export default class TimeLogger {
    private static total = 0
    private static queues = {}

    static increase(queueName, amount, index) {
        const queue = TimeLogger.queues[queueName] = TimeLogger.queues[queueName] || []
        const delta = amount - this.total
        queue[index] = (queue[index] || 0) + delta

        console.log(`Prior time: ${this.total.toFixed(4)} | Actual time: ${amount.toFixed(4)}`)

        this.total += delta
    }

    static getTotal() {
        return TimeLogger.total
    }

    static getQueues() {
        return TimeLogger.queues
    }
}