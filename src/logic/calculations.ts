import { LogarithmicValue } from "./logarithmicValue";
import type { ServiceState } from "./types";

export function calculateServiceOutput(service: ServiceState): LogarithmicValue {
    let added = service.definition.baseOutput.add(service.outputAdd)
    return added.mul(service.outputMul.rawValue)
}

export function calculateServiceInstability(service: ServiceState) {
    return (service.definition.baseInstability + service.instabilityAdd) * service.instabilityMul
}

export function calculateServicedownTime(service: ServiceState) {
    return service.definition.baseDowntime * (1 - service.downtimePercentageReduction)
}

export function calculateServiceCost(n: number, baseCost: LogarithmicValue, globalInstability = 0, growth = 1.75, softFactor = 0.18): LogarithmicValue {
    if (n == 0)
        return baseCost
    
    let baseCostMul = 
        n * Math.log10(growth) +
        Math.log10(1 + n * softFactor) +
        Math.log10(1 + globalInstability / 150)

    return baseCost.mul(Math.pow(10, baseCostMul))
}

export function calculateTraitCost(n: number, baseCost: LogarithmicValue, systemInstability = 0, exponentialGrowth = 1.18, linearGrowth = 0.35): LogarithmicValue {

    if (n == 0)
        return baseCost;
    
    let baseCostMul =
        n * Math.log10(exponentialGrowth) +
        Math.log10(1 + n * linearGrowth) +
        Math.log10(1 + systemInstability / 100)

    return baseCost.mul(Math.pow(10, baseCostMul))
}