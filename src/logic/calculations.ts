import { LogarithmicValue } from "./logarithmicValue";
import type { ServiceState } from "./types";

export function calculateServiceOutput(service: ServiceState): LogarithmicValue {
    let outputAdd = LogarithmicValue.zero()
    let outputMul = LogarithmicValue.fromValue(1)

    for(let mod of service.activeModifiers) {
        if (mod.target == "output") {
            switch (mod.type) {
                case "add":
                    outputAdd = outputAdd.add(mod.value)
                    break

                case "mul":
                    outputMul = outputMul.add(mod.value)
                    break
            }
        }
    }

    let added = service.definition.baseOutput.add(outputAdd)
    return added.mul(outputMul.rawValue)
}

export function calculateServiceInstability(service: ServiceState) {
    let instabilityAdd = 0
    let instabilityMul = 1

    for(let mod of service.activeModifiers) {
        if (mod.target == "instability") {
            switch (mod.type) {
                case "add":
                    instabilityAdd += mod.value.rawValue
                    break

                case "mul":
                    instabilityMul += mod.value.rawValue
                    break
            }
        }
    }

    return (service.definition.baseInstability + instabilityAdd) * instabilityMul
}

export function calculateServicedownTime(service: ServiceState) {
    let reductionPercentage = 0

    for(let mod of service.activeModifiers) {
        if (mod.target == "cooldown") {
            switch (mod.type) {
                case "add":
                    reductionPercentage += mod.value.rawValue
                    break

                case "mul":
                    throw new Error(`Can't mul cooldown for trait ${mod.source}`)
            }
        }
    }

    return service.definition.baseDowntime * (1 - reductionPercentage)
}

export function calculateServiceCost(n: number, baseCost: LogarithmicValue, globalInstability = 0, growth = 5, softFactor = 0.18): LogarithmicValue {

    if (window.location.host.includes("localhost"))
        return LogarithmicValue.fromValue(0)

    if (n == 0)
        return baseCost
    
    let baseCostMul = 
        n * Math.log10(growth) +
        Math.log10(1 + n * softFactor) +
        Math.log10(1 + globalInstability / 150)

    return baseCost.mul(Math.pow(10, baseCostMul))
}

export function calculateTraitCost(n: number, baseCost: LogarithmicValue, systemInstability = 0, exponentialGrowth = 1.75, linearGrowth = 0.35): LogarithmicValue {

    if (window.location.host.includes("localhost"))
        return LogarithmicValue.fromValue(0)

    if (n == 0)
        return baseCost;
    
    let baseCostMul =
        n * Math.log10(exponentialGrowth) +
        Math.log10(1 + n * linearGrowth) +
        Math.log10(1 + systemInstability / 100)

    return baseCost.mul(Math.pow(10, baseCostMul))
}