import { ServiceRegistry } from "../../serviceRegistry"
import type { GameState } from "../../state"
import type { SystemPickView } from "./system-pick-view"

export function buildSystemPickView(
  game: GameState
): SystemPickView {
  return {
    show: game.dialogs.systemPick.show,

    options: game.dialogs.systemPick.options
        .map(serviceId => {
            let definition = ServiceRegistry[serviceId]

            return {
                id: serviceId,
                icon: definition.icon,
                name: definition.displayName,
                description: definition.description,

                baseOutput: definition.baseOutput.toFormattedString(),
                baseInstabilityLevel: "low",
                baseDowntime: definition.baseDowntime
            }
        })
  }
}