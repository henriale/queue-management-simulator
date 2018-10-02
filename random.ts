abstract class Random {
    static numbers = []

    static init(numbers) {
        this.numbers = numbers

        return this
    }

    static gen(from: number, to: number): number {
        return 0
    }
    static outOfNumbers(): boolean {
        return false
    }
}

export class PseudoRandom extends Random {
    static gen(from: number, to: number): number {
        return (to - from) * this.numbers.shift() + from
    }

    static outOfNumbers() {
        return this.numbers.length < 2
    }
}

export class TrueRandom extends Random {
    static gen(from: number, to: number): number {
        return (to - from) * Math.random() + from
    }

    static outOfNumbers() {
        return false
    }
}

export class RandomFactory {
    static create(numbers: number[]): Random {
        if (numbers) {
            return PseudoRandom.init(numbers)
        }

        return new TrueRandom()
    }
}