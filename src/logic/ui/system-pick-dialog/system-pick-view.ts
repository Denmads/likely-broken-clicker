import type { ServiceId } from "../../types";

export interface SystemPickView {
    show: boolean,

    options: SystemPickOptionView[]
}

export interface SystemPickOptionView {
    id: ServiceId,
    icon: string,
    name: string,
    description: string,

    baseOutput: string,
    baseInstabilityLevel: "low" | "medium" | "high",
    baseDowntime: number
}