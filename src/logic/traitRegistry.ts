import type { ServiceId, TraitDefinition, TraitId } from "./types";
import * as GameState from './state'
import { LogarithmicValue } from "./logarithmicValue";

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
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "overclocked_turbines",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(4)
        });
        ctx.addModifier({
          source: "overclocked_turbines",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(1)
        });
      }
    }
  },

  improvised_fuel_mix: {
    id: "improvised_fuel_mix",
    name: "Improvised Fuel Mix",
    description: "Burns a highly experimental fuel blend. Efficiency increases. Stability does not.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "improvised_fuel_mix",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.25)
        });
        ctx.addModifier({
          source: "improvised_fuel_mix",
          target: "instability",
          type: "mul",
          value: LogarithmicValue.fromValue(0.2)
        });
      }
    }
  },

  self_igniting_coils: {
    id: "self_igniting_coils",
    name: "Self-Igniting Coils",
    description: "Occasionally ignites itself to jumpstart production. Fire suppression sold separately.",
    rarity: "cursed",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "self_igniting_coils",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.5)
        });
        ctx.addModifier({
          source: "self_igniting_coils",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(3)
        });
      }
    }
  },

  // ───────── Data Server ─────────
  redundant_arrays: {
    id: "redundant_arrays",
    name: "Redundant Arrays",
    description: "Adds more disks than necessary. Improves throughput but complicates everything.",
    rarity: "common",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "redundant_arrays",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(3)
        });
        ctx.addModifier({
          source: "redundant_arrays",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(1)
        });
      }
    }
  },

  aggressive_caching: {
    id: "aggressive_caching",
    name: "Aggressive Caching",
    description: "Caches everything, including corrupted data. Faster access, questionable accuracy.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "aggressive_caching",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.3)
        });
        ctx.addModifier({
          source: "aggressive_caching",
          target: "instability",
          type: "mul",
          value: LogarithmicValue.fromValue(0.25)
        });
      }
    }
  },

  haunted_storage_blocks: {
    id: "haunted_storage_blocks",
    name: "Haunted Storage Blocks",
    description: "Some data appears without being written. Some disappears forever.",
    rarity: "cursed",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "haunted_storage_blocks",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.6)
        });
        ctx.addModifier({
          source: "haunted_storage_blocks",
          target: "instability",
          type: "mul",
          value: LogarithmicValue.fromValue(0.5)
        });
      }
    }
  },

  // ───────── Cooling System ─────────
  industrial_fans: {
    id: "industrial_fans",
    name: "Industrial Fans",
    description: "Massive fans that move a lot of air and a lot of dust.",
    rarity: "common",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "industrial_fans",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(2)
        });
        ctx.addModifier({
          source: "industrial_fans",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(0.5)
        });
      }
    }
  },

  liquid_cooling_leaks: {
    id: "liquid_cooling_leaks",
    name: "Liquid Cooling (Leaks)",
    description: "Improves cooling efficiency, but slowly floods nearby systems.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "liquid_cooling_leaks",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.2)
        });
        ctx.addModifier({
          source: "liquid_cooling_leaks",
          target: "instability",
          type: "mul",
          value: LogarithmicValue.fromValue(0.15)
        });
      }
    }
  },

  // ───────── Network Hub ─────────
  packet_prioritization: {
    id: "packet_prioritization",
    name: "Packet Prioritization",
    description: "Decides which packets matter most. Often decides wrong.",
    rarity: "common",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "packet_prioritization",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(3)
        });
      }
    }
  },

  mesh_routing: {
    id: "mesh_routing",
    name: "Mesh Routing",
    description: "Routes traffic through every available cable, including broken ones.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "mesh_routing",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.25)
        });
        ctx.addModifier({
          source: "mesh_routing",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(1.5)
        });
      }
    }
  },

  quantum_tunneling: {
    id: "quantum_tunneling",
    name: "Quantum Tunneling",
    description: "Some packets arrive before they are sent. Others never arrive at all.",
    rarity: "rare",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "quantum_tunneling",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.45)
        });
        ctx.addModifier({
          source: "quantum_tunneling",
          target: "instability",
          type: "mul",
          value: LogarithmicValue.fromValue(0.35)
        });
      }
    }
  },

  // ───────── Backup Array ─────────
  incremental_backups: {
    id: "incremental_backups",
    name: "Incremental Backups",
    description: "Only backs up what changed. Sometimes forgets what changed.",
    rarity: "common",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "incremental_backups",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(2)
        });
      }
    }
  },

  recursive_backups: {
    id: "recursive_backups",
    name: "Recursive Backups",
    description: "Backs up backups of backups. Storage usage grows rapidly.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "recursive_backups",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.35)
        });
        ctx.addModifier({
          source: "recursive_backups",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(2)
        });
      }
    }
  },

  // ───────── Monitoring Console ─────────
  real_time_metrics: {
    id: "real_time_metrics",
    name: "Real-Time Metrics",
    description: "Updates graphs constantly, whether the data makes sense or not.",
    rarity: "common",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "real_time_metrics",
          target: "output",
          type: "add",
          value: LogarithmicValue.fromValue(2)
        });
      }
    }
  },

  predictive_alerts: {
    id: "predictive_alerts",
    name: "Predictive Alerts",
    description: "Predicts failures before they happen. Also predicts failures that never will.",
    rarity: "uncommon",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "predictive_alerts",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.2)
        });
        ctx.addModifier({
          source: "predictive_alerts",
          target: "instability",
          type: "add",
          value: LogarithmicValue.fromValue(1)
        });
      }
    }
  },

  confidence_meter: {
    id: "confidence_meter",
    name: "Confidence Meter",
    description: "Displays a reassuring green bar that has no relation to reality.",
    rarity: "rare",
    tags: [],
    effects: {
      onAttach: (ctx) => {
        ctx.addModifier({
          source: "confidence_meter",
          target: "output",
          type: "mul",
          value: LogarithmicValue.fromValue(0.4)
        });
      }
    }
  }
};