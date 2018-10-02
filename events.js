"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = require("./random");
var timer_1 = require("./timer");
var E = /** @class */ (function () {
    function E(time, queue, destination) {
        this.time = time;
        this.queue = queue;
        this.destination = destination;
    }
    E.prototype.clock = function () {
        timer_1.default.increase(this.queue.getName(), this.getTime(), this.queue.getSize());
    };
    E.prototype.getTime = function () {
        return this.time;
    };
    return E;
}());
exports.E = E;
var ArrivalFactory = /** @class */ (function () {
    function ArrivalFactory() {
    }
    ArrivalFactory.create = function (queue) {
        var input = queue.getInput();
        var random = random_1.PseudoRandom.gen(input.from, input.to);
        var time = timer_1.default.getTotal() + random;
        console.log(queue.getName() + ": Scheduling an arrival to " + time.toFixed(4));
        return new Arrival(time, queue);
    };
    return ArrivalFactory;
}());
var LeavingFactory = /** @class */ (function () {
    function LeavingFactory() {
    }
    LeavingFactory.create = function (queue, queues, destinationName) {
        if (!destinationName) {
            return ForwentFactory.create(queue);
        }
        var destination = destinationFromName(queues, destinationName);
        return ForwardFactory.create(queue, destination);
    };
    return LeavingFactory;
}());
var ForwentFactory = /** @class */ (function () {
    function ForwentFactory() {
    }
    ForwentFactory.create = function (queue) {
        var output = queue.getOutput();
        var random = random_1.PseudoRandom.gen(output.from, output.to);
        var time = timer_1.default.getTotal() + random;
        console.log(queue.getName() + ": Scheduling a leaving to " + time.toFixed(4));
        return new Forwent(time, queue);
    };
    return ForwentFactory;
}());
var ForwardFactory = /** @class */ (function () {
    function ForwardFactory() {
    }
    ForwardFactory.create = function (queue, destination) {
        var output = queue.getOutput();
        var random = random_1.PseudoRandom.gen(output.from, output.to);
        var time = timer_1.default.getTotal() + random;
        console.log(queue.getName() + ": Scheduling a forward to " + time.toFixed(4));
        return new Forward(time, queue, destination);
    };
    return ForwardFactory;
}());
var Leaving = /** @class */ (function (_super) {
    __extends(Leaving, _super);
    function Leaving() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Leaving;
}(E));
var Arrival = /** @class */ (function (_super) {
    __extends(Arrival, _super);
    function Arrival() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arrival.prototype.execute = function (queues) {
        var queue = this.queue;
        this.clock();
        console.log("Arrival at " + timer_1.default.getTotal().toFixed(4) + " in " + queue.getName());
        if (random_1.PseudoRandom.outOfNumbers()) {
            return [];
        }
        if (queue.isFull()) {
            return [ArrivalFactory.create(queue)];
        }
        queue.enqueue();
        if (!queue.isThereIdleServers()) {
            return [
                ArrivalFactory.create(queue)
            ];
        }
        var probability = random_1.PseudoRandom.gen(0, 1);
        var destination = queue.getDestination(0);
        if (destination.probability <= probability) {
            destination = queue.getDestination(1);
        }
        return [
            LeavingFactory.create(queue, queues, destination.name),
            ArrivalFactory.create(queue)
        ];
    };
    return Arrival;
}(E));
exports.Arrival = Arrival;
var Forwent = /** @class */ (function (_super) {
    __extends(Forwent, _super);
    function Forwent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forwent.prototype.execute = function (queues) {
        var queue = this.queue;
        this.clock();
        console.log("Leaving at " + timer_1.default.getTotal().toFixed(4) + " in " + queue.getName());
        if (random_1.PseudoRandom.outOfNumbers()) {
            return [];
        }
        queue.dequeue();
        if (!queue.isAllServersBusy()) {
            return [];
        }
        return [ForwentFactory.create(queue)];
    };
    return Forwent;
}(Leaving));
exports.Forwent = Forwent;
var Forward = /** @class */ (function (_super) {
    __extends(Forward, _super);
    function Forward() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forward.prototype.execute = function (queues) {
        var queue = this.queue;
        this.clock();
        console.log("Forward at " + timer_1.default.getTotal().toFixed(4) + " in " + queue.getName());
        if (random_1.PseudoRandom.outOfNumbers()) {
            return [];
        }
        var events = [];
        queue.dequeue();
        if (queue.isAllServersBusy()) {
            var probability = random_1.PseudoRandom.gen(0, 1);
            var destination_1 = queue.getDestination(0);
            if (destination_1.probability <= probability) {
                destination_1 = queue.getDestination(1);
            }
            console.log("   -> to: " + destination_1.name);
            events.push(LeavingFactory.create(queue, queues, destination_1.name));
        }
        var destination = this.destination;
        destination.enqueue();
        console.log("   -> to: " + destination.getName());
        if (!destination.isThereIdleServers()) {
            return [];
        }
        events.push(ForwentFactory.create(destination));
        return events;
    };
    return Forward;
}(Leaving));
exports.Forward = Forward;
function destinationFromName(queues, destinationName) {
    return queues.filter(function (q) {
        return q.getName() === destinationName;
    })[0];
}
//# sourceMappingURL=events.js.map