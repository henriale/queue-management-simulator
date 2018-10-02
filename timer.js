"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timer = /** @class */ (function () {
    function Timer() {
    }
    Timer.increase = function (queueName, amount, index) {
        var queue = Timer.queues[queueName] = Timer.queues[queueName] || [];
        var delta = amount - this.global;
        queue[index] = (queue[index] || 0) + delta;
        console.log("[Global time: " + this.global + " | Actual time: " + amount + "]");
        this.global += delta;
    };
    Timer.getGlobal = function () {
        return Timer.global;
    };
    Timer.getQueues = function () {
        return Timer.queues;
    };
    Timer.global = 0;
    /*private*/ Timer.queues = {};
    return Timer;
}());
exports.default = Timer;
//# sourceMappingURL=timer.js.map