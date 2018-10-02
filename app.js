"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("./timer");
var simulator_1 = require("./simulator");
var config = require("./configs/example1.json");
var sim = new simulator_1.Simulator(config.queues, config.initial, config.randoms);
for (var i = 1; !sim.ended(); i++) {
    sim.step(i);
}
console.log(timer_1.default.getGlobal());
console.log(timer_1.default.getQueues());
//# sourceMappingURL=app.js.map