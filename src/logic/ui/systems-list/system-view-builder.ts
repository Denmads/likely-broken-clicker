import type { GameState } from "../../state"
import { TraitRegistry } from "../../traitRegistry"
import type { ServiceState } from "../../types"
import type { AddSystemView, SystemView } from "./system-view"

export function buildSystemView(
  service: ServiceState,
  game: GameState
): SystemView {
  const instability = service.totalInstability

  return {
    id: service.definition.id,
    name: service.definition.displayName,
    icon: service.definition.icon,

    outputText: service.totalOutput.toFormattedString(),
    instabilityPercent: 50,
    instabilityState: "ok",

    traits: service.traits.map(id => ({
      id,
      name: TraitRegistry[id].name,
      severity: TraitRegistry[id].rarity === "cursed"
        ? "error"
        : "normal"
    })),

    addTrait: {
        show: false,
        disable: false
    }
  }
}

export function buildAddSystemView(
  game: GameState
): AddSystemView {

  return {
    cost: game.costs.newServiceCost.toFormattedString(),
    affordable: game.costs.newServiceCost.compare(game.resources.operations.value) != -1
  }
}