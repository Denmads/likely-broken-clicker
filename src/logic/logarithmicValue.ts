const LOG_EPSILON = 1e-12

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

    sub(other: LogarithmicValue): LogarithmicValue {
        if (other.isZero()) return this;
        
        if (this.isZero() || other.log10Value! >= this.log10Value! - LOG_EPSILON) {
            return LogarithmicValue.zero()
        }

        let diff = other.log10Value! - this.log10Value!
        return new LogarithmicValue(this.log10Value! + Math.log10(1 - Math.pow(10, diff)))
    }

    mul(value: number) {
        if (this.isZero() || value <= 0) return LogarithmicValue.zero();
        return new LogarithmicValue(this.log! + Math.log10(value))
    }

    compare(other: LogarithmicValue): number {
        if (this.isZero() && !other.isZero()) return 1
        if (!this.isZero() && other.isZero()) return -1

        let diff = Math.abs(this.log10Value! - other.log10Value!)
        if (diff <= LOG_EPSILON) return 0

        if (this.log10Value! > other.log10Value!) return -1
        else return 1
    }

    toFormattedString(): string {
        if (this.isZero()) return "0"

        if (this.log! < 3) {
            let val = Math.pow(10, this.log!);
            const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0})
            return formatter.format(val)
        }

        const units = [
            "", "K", "M", "B", "T", // thousand → trillion
            "Qa", "Qi", "Sx", "Sp", "Oc", "No", // quadrillion → novemdecillion
            "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nd", // 10^33 → 10^51
            "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg", // 10^54 → 10^81
            "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg", // 10^84 → 10^111
            "Qg", "Uqg", "Dqg", "Tqg", "Qaqg", "Qiqg", "Sxqg", "Spqg", "Ocqg", "Noqg", // 10^114 → 10^141
            "Rg", "Urg", "Drg", "Trg", "Qarg", "Qirg", "Sxrg", "Sprg", "Ocrg", "Norg", // 10^144 → 10^171
            "Cg", "Ucg", "Dcg", "Tcg", "Qacg", "Qicg", "Sxcg", "Spcg", "Occg", "Nocg", // 10^174 → 10^201
            "Mg", "Umg", "Dmg", "Tmg", "Qamg", "Qimg", "Sxmg", "Spmg", "Ocmg", "Nomg", // 10^204 → 10^231
            "Gg", "Ugg", "Dgg", "Tgg", "Qagg", "Qigg", "Sxgg", "Spgg", "Ocgg", "Nogg"  // 10^234 → 10^261+
        ];

        let u = 0;
        let logVal = this.log!;
        while (logVal >= 3 && u < units.length - 1) {
            logVal -= 3;
            u++;
        }

        let val = Math.pow(10, this.log! % 3);

        const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2})
        return `${formatter.format(val)}${units[u]}`;
    }
}