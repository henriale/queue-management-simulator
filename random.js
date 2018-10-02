"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PseudoRandom = /** @class */ (function () {
    function PseudoRandom() {
    }
    PseudoRandom.init = function (numbers) {
        this.numbers = numbers;
    };
    PseudoRandom.gen = function (from, to) {
        return (to - from) * this.numbers.shift() + from;
    };
    PseudoRandom.numbers = [];
    return PseudoRandom;
}());
exports.PseudoRandom = PseudoRandom;
//# sourceMappingURL=random.js.map