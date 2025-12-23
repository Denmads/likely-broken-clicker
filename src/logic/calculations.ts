import type { LogarithmicValue } from "./logarithmicValue";
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