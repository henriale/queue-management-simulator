export class PseudoRandom {
    static numbers = []

    static init(numbers) {
        this.numbers = numbers
    }

    static gen(from, to) {
        return (to - from) * this.numbers.shift() + from
    }
}