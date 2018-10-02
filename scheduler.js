"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scheduler = /** @class */ (function () {
    function Scheduler(events) {
        this.events = [];
        this.schedule(events);
    }
    Scheduler.prototype.next = function () {
        return this.events.shift();
    };
    Scheduler.prototype.schedule = function (events) {
        if (!(events instanceof Array)) {
            events = [events];
        }
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            this.events.push(event_1);
        }
        this.sort();
    };
    Scheduler.prototype.sort = function () {
        this.events.sort(function (a, b) { return a.time > b.time ? 1 : -1; });
    };
    Scheduler.prototype.empty = function () {
        return this.events.length === 0;
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
//# sourceMappingURL=scheduler.js.map