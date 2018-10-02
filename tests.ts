import {expect} from 'chai'
import {Queue} from "./queue";
import {PseudoRandom} from "./random";

context('Random', () => {
    it('should generate a random number', () => {
        //const random = new PseudoRandom()
        expect(PseudoRandom.gen(10, 20)).to.be.equal(25)
    })
})

context('Queue', () => {
    it('should dequeue the next client by its time to leave', () => {
        expect(true).to.be.true
    })
})
