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
    function E(time, origin, destination) {
        this.time = time;
        this.origin = origin;
        this.destination = destination;
    }
    E.prototype.clock = function () {
        timer_1.default.increase(this.origin.getName(), this.time, this.origin.getSize());
    };
    E.prototype.outOfRandoms = function () {
        if (random_1.PseudoRandom.numbers.length < 2) {
            return true;
        }
        return false;
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
        var time = timer_1.default.getGlobal() + random;
        console.log(queue.getName() + ": Scheduling an arrival to " + time.toFixed(4));
        return new Arrival(time, queue);
    };
    return ArrivalFactory;
}());
var LeavingFactory = /** @class */ (function () {
    function LeavingFactory() {
    }
    LeavingFactory.create = function (queue) {
        var output = queue.getOutput();
        var random = random_1.PseudoRandom.gen(output.from, output.to);
        var time = timer_1.default.getGlobal() + random;
        console.log(queue.getName() + ": Scheduling a leaving to " + time.toFixed(4));
        return new Leaving(time, queue);
    };
    return LeavingFactory;
}());
var ForwardFactory = /** @class */ (function () {
    function ForwardFactory() {
    }
    ForwardFactory.create = function (queue, queues, destinationName) {
        if (!destinationName) {
            return LeavingFactory.create(queue);
        }
        var destination = destinationFromName(queues, destinationName);
        var output = queue.getOutput();
        var random = random_1.PseudoRandom.gen(output.from, output.to);
        var time = timer_1.default.getGlobal() + random;
        console.log(queue.getName() + ": Scheduling a forward to " + time.toFixed(4));
        return new Forward(time, queue, destination);
    };
    return ForwardFactory;
}());
var Arrival = /** @class */ (function (_super) {
    __extends(Arrival, _super);
    function Arrival() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arrival.prototype.execute = function (queues) {
        var origin = this.origin;
        this.clock();
        console.log("Arrival at " + timer_1.default.getGlobal().toFixed(4) + " in " + origin.getName());
        if (this.outOfRandoms()) {
            return [];
        }
        if (origin.isFull()) {
            return [ArrivalFactory.create(origin)];
        }
        origin.enqueue();
        if (!origin.isThereIdleServers()) {
            return [
                ArrivalFactory.create(origin)
            ];
        }
        var probability = random_1.PseudoRandom.gen(0, 1);
        var destination = origin.getDestination(0);
        if (destination.probability <= probability) {
            destination = origin.getDestination(1);
        }
        return [
            ForwardFactory.create(origin, queues, destination.name),
            ArrivalFactory.create(origin)
        ];
    };
    return Arrival;
}(E));
exports.Arrival = Arrival;
var Leaving = /** @class */ (function (_super) {
    __extends(Leaving, _super);
    function Leaving() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Leaving.prototype.execute = function (queues) {
        var origin = this.origin;
        this.clock();
        console.log("Leaving at " + timer_1.default.getGlobal().toFixed(4) + " in " + origin.getName());
        if (this.outOfRandoms()) {
            return [];
        }
        origin.dequeue();
        if (!origin.isAllServersBusy()) {
            return [];
        }
        return [LeavingFactory.create(origin)];
    };
    return Leaving;
}(E));
exports.Leaving = Leaving;
var Forward = /** @class */ (function (_super) {
    __extends(Forward, _super);
    function Forward() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forward.prototype.execute = function (queues) {
        var origin = this.origin;
        this.clock();
        console.log("Forward at " + timer_1.default.getGlobal().toFixed(4) + " in " + origin.getName());
        if (this.outOfRandoms()) {
            return [];
        }
        var events = [];
        origin.dequeue();
        if (origin.isAllServersBusy()) {
            var probability = random_1.PseudoRandom.gen(0, 1);
            var destination_1 = origin.getDestination(0);
            if (destination_1.probability <= probability) {
                destination_1 = origin.getDestination(1);
            }
            console.log("   -> to: " + destination_1.name);
            events.push(ForwardFactory.create(origin, queues, destination_1.name));
        }
        var destination = this.destination;
        destination.enqueue();
        console.log("   -> to: " + destination.getName());
        if (!destination.isThereIdleServers()) {
            return [];
        }
        events.push(LeavingFactory.create(destination));
        return events;
        // const probability = PseudoRandom.gen(0, 1)
        // let destination = origin.getDestination(0)
        //
        // if (destination.probability <= probability) {
        //     destination = origin.getDestination(1)
        // }
        //
        // return [
        //     ForwardFactory.create(origin, queues, destination.name),
        //     ArrivalFactory.create(origin)
        // ]
    };
    return Forward;
}(E));
exports.Forward = Forward;
function destinationFromName(queues, destinationName) {
    return queues.filter(function (q) {
        return q.getName() === destinationName;
    })[0];
}
//# sourceMappingURL=events.js.map