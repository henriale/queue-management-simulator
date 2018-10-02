"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = /** @class */ (function () {
    function Queue(servers, capacity, name, input, output, detinations) {
        this.capacity = capacity - servers;
        this.detinations = detinations;
        this.servers = servers;
        this.output = output;
        this.input = input;
        this.name = name;
        this.size = 0;
    }
    Queue.prototype.enqueue = function () {
        this.size += 1;
    };
    Queue.prototype.dequeue = function () {
        this.size -= 1;
    };
    Queue.prototype.isFull = function () {
        return this.size === (this.capacity + this.servers);
    };
    Queue.prototype.isAllServersBusy = function () {
        return this.size >= this.servers;
    };
    Queue.prototype.isThereIdleServers = function () {
        return this.size <= this.servers;
    };
    Queue.prototype.empty = function () {
        return this.size < this.servers;
    };
    Queue.prototype.getName = function () {
        return this.name;
    };
    Queue.prototype.getSize = function () {
        return this.size;
    };
    Queue.prototype.getInput = function () {
        return this.input;
    };
    Queue.prototype.getOutput = function () {
        return this.output;
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map