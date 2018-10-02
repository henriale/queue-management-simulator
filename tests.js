"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var random_1 = require("./random");
context('Random', function () {
    it('should generate a random number', function () {
        //const random = new PseudoRandom()
        chai_1.expect(random_1.PseudoRandom.gen(10, 20)).to.be.equal(25);
    });
});
context('Queue', function () {
    it('should dequeue the next client by its time to leave', function () {
        chai_1.expect(true).to.be.true;
    });
});
//# sourceMappingURL=tests.js.map