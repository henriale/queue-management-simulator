"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("./timer");
var simulator_1 = require("./simulator");
var config = require("./configs/example1.json");
var sim = new simulator_1.Simulator(config.queues, config.initial, config.randoms);
for (var i = 1; !sim.ended(); i++) {
    sim.step(i);
}
console.log("=========== REPORT ===========");
var totalTime = timer_1.default.getGlobal();
console.log("Time of execution: " + totalTime + "\n");
var queues = timer_1.default.getQueues();
for (var key in queues) {
    var queue = queues[key];
    console.log("probability for queue " + key);
    for (var i in queue) {
        var time = queue[i].toFixed(2);
        var prob = (queue[i] / totalTime * 100).toFixed(2);
        console.log(i + " => " + time + " - " + prob + "%");
    }
}
//# sourceMappingURL=app.js.map