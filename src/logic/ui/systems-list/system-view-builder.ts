import { getServiceAllowedOptions } from "../../serviceRegistry"
import { getCurrentServiceCost, getCurrentTraitCostForService, type GameState } from "../../state"
import { TraitRegistry } from "../../traitRegistry"
import type { ServiceState } from "../../types"
import type { AddSystemView, SystemView } from "./system-view"

export function buildSystemView(
  service: ServiceState,
  game: GameState
): SystemView {
  const instability = service.totalInstability
    const currentTraitCost = getCurrentTraitCostForService(service.definition.id)

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
        show: service.traits.length < service.definition.maxTraits,
        disable: currentTraitCost.compare(game.resources.operations.value) == -1,
        cost: currentTraitCost.toFormattedString()
    }
  }
}

export function buildAddSystemView(
  game: GameState
): AddSystemView {

    let serviceCost = getCurrentServiceCost()

  return {
    cost: serviceCost.toFormattedString(),
    affordable: serviceCost.compare(game.resources.operations.value) != -1 && getServiceAllowedOptions().length > 0
  }
}