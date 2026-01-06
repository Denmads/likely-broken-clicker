import type { ServiceId, TraitDefinition, TraitId } from "./types";
import * as GameState from './state'

export function getTraitPickOptionsForService(serviceId: ServiceId, n: number = 2): TraitId[] {
    let allowedOptions = getAllowedTraitOptionsForService(serviceId)

    if (allowedOptions.length <= n)
        return allowedOptions

    let options: TraitId[] = []
    while (options.length < n) {
        let trait = allowedOptions[Math.floor(Math.random() * allowedOptions.length)]

        options.push(trait)
        allowedOptions = allowedOptions.filter(v => v != trait)
    }

    return options
}

export function getAllowedTraitOptionsForService(serviceId: ServiceId): TraitId[] {
    let serviceState = GameState.state.services.find(s => s.definition.id == serviceId)!

    return serviceState.definition.availableTraits.filter(t => !serviceState.traits.includes(t))
}

export const TraitRegistry: Record<TraitId, TraitDefinition> = {
    // ───────── Power Generator ─────────
  overclocked_turbines: {
    id: "overclocked_turbines",
    name: "Overclocked Turbines",
    description: "Spins the turbines well beyond safe limits. Generates more power, safety not included.",
    rarity: "common",
    tags: [],
    effects: []
  },
  improvised_fuel_mix: {
    id: "improvised_fuel_mix",
    name: "Improvised Fuel Mix",
    description: "Burns a highly experimental fuel blend. Efficiency increases. Stability does not.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },
  self_igniting_coils: {
    id: "self_igniting_coils",
    name: "Self-Igniting Coils",
    description: "Occasionally ignites itself to jumpstart production. Fire suppression sold separately.",
    rarity: "cursed",
    tags: [],
    effects: []
  },

  // ───────── Data Server ─────────
  redundant_arrays: {
    id: "redundant_arrays",
    name: "Redundant Arrays",
    description: "Adds more disks than necessary. Improves throughput but complicates everything.",
    rarity: "common",
    tags: [],
    effects: []
  },
  aggressive_caching: {
    id: "aggressive_caching",
    name: "Aggressive Caching",
    description: "Caches everything, including corrupted data. Faster access, questionable accuracy.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },
  haunted_storage_blocks: {
    id: "haunted_storage_blocks",
    name: "Haunted Storage Blocks",
    description: "Some data appears without being written. Some disappears forever.",
    rarity: "cursed",
    tags: [],
    effects: []
  },

  // ───────── Cooling System ─────────
  industrial_fans: {
    id: "industrial_fans",
    name: "Industrial Fans",
    description: "Massive fans that move a lot of air and a lot of dust.",
    rarity: "common",
    tags: [],
    effects: []
  },
  liquid_cooling_leaks: {
    id: "liquid_cooling_leaks",
    name: "Liquid Cooling (Leaks)",
    description: "Improves cooling efficiency, but slowly floods nearby systems.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },

  // ───────── Network Hub ─────────
  packet_prioritization: {
    id: "packet_prioritization",
    name: "Packet Prioritization",
    description: "Decides which packets matter most. Often decides wrong.",
    rarity: "common",
    tags: [],
    effects: []
  },
  mesh_routing: {
    id: "mesh_routing",
    name: "Mesh Routing",
    description: "Routes traffic through every available cable, including broken ones.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },
  quantum_tunneling: {
    id: "quantum_tunneling",
    name: "Quantum Tunneling",
    description: "Some packets arrive before they are sent. Others never arrive at all.",
    rarity: "rare",
    tags: [],
    effects: []
  },

  // ───────── Backup Array ─────────
  incremental_backups: {
    id: "incremental_backups",
    name: "Incremental Backups",
    description: "Only backs up what changed. Sometimes forgets what changed.",
    rarity: "common",
    tags: [],
    effects: []
  },
  recursive_backups: {
    id: "recursive_backups",
    name: "Recursive Backups",
    description: "Backs up backups of backups. Storage usage grows rapidly.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },

  // ───────── Monitoring Console ─────────
  real_time_metrics: {
    id: "real_time_metrics",
    name: "Real-Time Metrics",
    description: "Updates graphs constantly, whether the data makes sense or not.",
    rarity: "common",
    tags: [],
    effects: []
  },
  predictive_alerts: {
    id: "predictive_alerts",
    name: "Predictive Alerts",
    description: "Predicts failures before they happen. Also predicts failures that never will.",
    rarity: "uncommon",
    tags: [],
    effects: []
  },
  confidence_meter: {
    id: "confidence_meter",
    name: "Confidence Meter",
    description: "Displays a reassuring green bar that has no relation to reality.",
    rarity: "rare",
    tags: [],
    effects: []
  }
}