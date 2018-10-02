"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("./timer");
var simulator_1 = require("./simulator");
var config = require("./configs/example2.json");
var sim = new simulator_1.Simulator(config.queues, config.initial, config.randoms);
for (var i = 1; !sim.ended(); i++) {
    sim.step(i);
}
console.log("=========== REPORT ===========");
var totalTime = timer_1.default.getGlobal();
console.log("Execution time: " + totalTime.toFixed(4) + "\n");
var queues = timer_1.default.getQueues();
for (var key in queues) {
    var queue = queues[key];
    console.log("Probability for queue " + key);
    for (var i in queue) {
        var time = queue[i].toFixed(2);
        var prob = (queue[i] / totalTime * 100).toFixed(2);
        console.log(i + " => " + time + " - " + prob + "%");
    }
    console.log();
}
//# sourceMappingURL=app.js.map