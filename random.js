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
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.init = function (numbers) {
        this.numbers = numbers;
        return this;
    };
    Random.gen = function (from, to) {
        return 0;
    };
    Random.outOfNumbers = function () {
        return false;
    };
    Random.numbers = [];
    return Random;
}());
var PseudoRandom = /** @class */ (function (_super) {
    __extends(PseudoRandom, _super);
    function PseudoRandom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PseudoRandom.gen = function (from, to) {
        return (to - from) * this.numbers.shift() + from;
    };
    PseudoRandom.outOfNumbers = function () {
        return this.numbers.length < 2;
    };
    return PseudoRandom;
}(Random));
exports.PseudoRandom = PseudoRandom;
var TrueRandom = /** @class */ (function (_super) {
    __extends(TrueRandom, _super);
    function TrueRandom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrueRandom.gen = function (from, to) {
        return (to - from) * Math.random() + from;
    };
    TrueRandom.outOfNumbers = function () {
        return false;
    };
    return TrueRandom;
}(Random));
exports.TrueRandom = TrueRandom;
var RandomFactory = /** @class */ (function () {
    function RandomFactory() {
    }
    RandomFactory.create = function (numbers) {
        if (numbers) {
            return PseudoRandom.init(numbers);
        }
        return new TrueRandom();
    };
    return RandomFactory;
}());
exports.RandomFactory = RandomFactory;
//# sourceMappingURL=random.js.map