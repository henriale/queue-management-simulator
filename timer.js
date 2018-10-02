"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimeLogger = /** @class */ (function () {
    function TimeLogger() {
    }
    TimeLogger.increase = function (queueName, amount, index) {
        var queue = TimeLogger.queues[queueName] = TimeLogger.queues[queueName] || [];
        var delta = amount - this.total;
        queue[index] = (queue[index] || 0) + delta;
        console.log("Prior time: " + this.total.toFixed(4) + " | Actual time: " + amount.toFixed(4));
        this.total += delta;
    };
    TimeLogger.getTotal = function () {
        return TimeLogger.total;
    };
    TimeLogger.getQueues = function () {
        return TimeLogger.queues;
    };
    TimeLogger.total = 0;
    TimeLogger.queues = {};
    return TimeLogger;
}());
exports.default = TimeLogger;
//# sourceMappingURL=timer.js.map