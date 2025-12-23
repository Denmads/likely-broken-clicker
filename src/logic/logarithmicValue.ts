import { formatLog10Number } from "./ui";

export class LogarithmicValue {

    static zero(): LogarithmicValue {
        return new LogarithmicValue(null);
    }

    static fromValue(value: number): LogarithmicValue {
        if (value <= 0) return LogarithmicValue.zero();

        return new LogarithmicValue(Math.log10(value));
    }


    private log: number | null;

    constructor(intialValue: number | null = null) {
        this.log = intialValue
    }   

    isZero(): boolean {
        return this.log == null
    }

    get log10Value(): number | null {
        return this.log
    }

    get rawValue(): number {
        if (this.isZero())
            return 0;

        return Math.pow(10, this.log!)
    }

    add(other: LogarithmicValue): LogarithmicValue {
        if (this.isZero()) return other;
        if (other.isZero()) return this;

        let maxLog = Math.max(this.log10Value!, other.log10Value!)
        let minLog = Math.min(this.log10Value!, other.log10Value!)

        return new LogarithmicValue(
            maxLog + Math.log10(1 + Math.pow(10, minLog - maxLog))
        )
    }

    mul(value: number) {
        if (this.isZero() || value <= 0) return LogarithmicValue.zero();
        return new LogarithmicValue(this.log! + Math.log10(value))
    }

    toFormattedString(): string {
        return formatLog10Number(this.log ?? 0)
    }
}