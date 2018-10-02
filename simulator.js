"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("./queue");
var events_1 = require("./events");
var scheduler_1 = require("./scheduler");
var random_1 = require("./random");
var Simulator = /** @class */ (function () {
    function Simulator(queues, initials, randoms) {
        this.queues = this.parseQueues(queues);
        this.scheduler = new scheduler_1.Scheduler(this.parseFirstArrivals(initials));
        random_1.PseudoRandom.init(randoms);
    }
    Simulator.prototype.step = function (i) {
        console.log("========= round: " + i + " =========");
        var event = this.scheduler.next();
        var events = event.execute();
        this.scheduler.schedule(events);
        console.log();
    };
    Simulator.prototype.ended = function () {
        return this.scheduler.empty();
    };
    Simulator.prototype.parseFirstArrivals = function (arrivals) {
        var parsed = [];
        var _loop_1 = function (arrival) {
            var queue = this_1.queues.filter(function (q) {
                return q.getName() === arrival.queue;
            })[0];
            parsed.push(new events_1.Arrival(arrival.time, queue));
        };
        var this_1 = this;
        for (var _i = 0, arrivals_1 = arrivals; _i < arrivals_1.length; _i++) {
            var arrival = arrivals_1[_i];
            _loop_1(arrival);
        }
        return parsed;
    };
    Simulator.prototype.parseQueues = function (queues) {
        var parsed = [];
        for (var _i = 0, queues_1 = queues; _i < queues_1.length; _i++) {
            var queue = queues_1[_i];
            parsed.push(new queue_1.Queue(queue.servers, queue.capacity, queue.name, queue.wires.arrivals, queue.wires.leavings, queue.wires.destinations));
        }
        return parsed;
    };
    return Simulator;
}());
exports.Simulator = Simulator;
//# sourceMappingURL=simulator.js.map