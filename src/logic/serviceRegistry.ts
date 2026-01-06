import type { ServiceDefinition, ServiceId } from "./types";
import * as GameState from './state';
import { LogarithmicValue } from "./logarithmicValue";

export function getServicePickOptions(n: number): ServiceId[] {
    let allowedOptions = getServiceAllowedOptions();

    if (allowedOptions.length <= n)
        return allowedOptions;

    let options: ServiceId[] = []
    while (options.length < n) {
        let service = allowedOptions[Math.floor(Math.random() * allowedOptions.length)]

        options.push(service)
        allowedOptions = allowedOptions.filter(v => v != service)
    }

    return options
}

export function getServiceAllowedOptions(): ServiceId[] {

    let existingServices = GameState.state.services
        .map(s => s.definition.id)

    let allowedOptions = Object.keys(ServiceRegistry)
        .filter(val => !existingServices.includes(val))

    return allowedOptions;
}

export const ServiceRegistry: Record<ServiceId, ServiceDefinition> = {
    "power_generator": {
    id: "power_generator",
    icon: "⚡",
    displayName: "Power Generator",
    description: "Produces electricity by aggressively vibrating aging machinery. Occasionally catches fire.",
    maxTraits: 3,
    baseOutput: LogarithmicValue.fromValue(12),
    baseInstability: 0.15,
    baseDowntime: 0.05,
    availableTraits: [
        "overclocked_turbines",
        "improvised_fuel_mix",
        "self_igniting_coils"
    ]
  },
  "data_server": {
    id: "data_server",
    icon: "🗄️",
    displayName: "Data Server",
    description: "Stores critical data on spinning disks held together by hope and duct tape.",
    maxTraits: 4,
    baseOutput: LogarithmicValue.fromValue(18),
    baseInstability: 0.2,
    baseDowntime: 0.08,
    availableTraits: [
        "redundant_arrays",
        "aggressive_caching",
        "haunted_storage_blocks"
    ]
  },
  "cooling_system": {
    id: "cooling_system",
    icon: "🌀",
    displayName: "Cooling System",
    description: "Keeps other systems from melting by blowing lukewarm air at them.",
    maxTraits: 2,
    baseOutput: LogarithmicValue.fromValue(6),
    baseInstability: 0.1,
    baseDowntime: 0.03,
    availableTraits: [
        "industrial_fans",
        "liquid_cooling_leaks"
    ]
  },
  "network_hub": {
    id: "network_hub",
    icon: "🌐",
    displayName: "Network Hub",
    description: "Routes packets through a maze of cables, some of which may not exist anymore.",
    maxTraits: 3,
    baseOutput: LogarithmicValue.fromValue(14),
    baseInstability: 0.18,
    baseDowntime: 0.06,
    availableTraits: [
        "packet_prioritization",
        "mesh_routing",
        "quantum_tunneling"
    ]
  },
  "backup_array": {
    id: "backup_array",
    icon: "💾",
    displayName: "Backup Array",
    description: "Creates backups of backups. Restores none of them correctly.",
    maxTraits: 2,
    baseOutput: LogarithmicValue.fromValue(8),
    baseInstability: 0.12,
    baseDowntime: 0.04,
    availableTraits: [
        "incremental_backups",
        "recursive_backups"
    ]
  },
  "monitoring_console": {
    id: "monitoring_console",
    icon: "📊",
    displayName: "Monitoring Console",
    description: "Displays dozens of graphs that no one understands but everyone trusts.",
    maxTraits: 3,
    baseOutput: LogarithmicValue.fromValue(10),
    baseInstability: 0.09,
    baseDowntime: 0.02,
    availableTraits: [
        "real_time_metrics",
        "predictive_alerts",
        "confidence_meter"
    ]
  }
}