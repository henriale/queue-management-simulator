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
    function E(time, queue) {
        this.time = time;
        this.queue = queue;
    }
    E.prototype.clock = function () {
        timer_1.default.increase(this.queue.getName(), this.time, this.queue.getSize());
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
        console.log("Scheduling an arrival to " + time);
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
        console.log("Scheduling a leaving to " + time);
        return new Leaving(time, queue);
    };
    return LeavingFactory;
}());
var Arrival = /** @class */ (function (_super) {
    __extends(Arrival, _super);
    function Arrival() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arrival.prototype.execute = function () {
        this.clock();
        console.log("Arrival at " + timer_1.default.getGlobal());
        if (this.outOfRandoms()) {
            return [];
        }
        var queue = this.queue;
        if (queue.isFull()) {
            return [ArrivalFactory.create(queue)];
        }
        queue.enqueue();
        if (queue.isThereIdleServers()) {
            return [
                LeavingFactory.create(queue),
                ArrivalFactory.create(queue)
            ];
        }
        return [
            ArrivalFactory.create(queue)
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
    Leaving.prototype.execute = function () {
        this.clock();
        console.log("Leaving at " + timer_1.default.getGlobal());
        if (this.outOfRandoms()) {
            return [];
        }
        var queue = this.queue;
        queue.dequeue();
        if (!queue.isAllServersBusy()) {
            return [];
        }
        return [LeavingFactory.create(queue)];
    };
    return Leaving;
}(E));
exports.Leaving = Leaving;
//# sourceMappingURL=events.js.map