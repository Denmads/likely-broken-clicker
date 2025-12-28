import { GameLoop } from "./core";
import type { GameEvent } from "./types";
import * as GameState from './state';
import { getServicePickOptions } from "./serviceRegistry";

function openSystemPickDialog(event: GameEvent) {
    if (GameState.state.dialogs.systemPick.show) {
        return;
    }

    if (GameState.state.costs.newServiceCost.compare(GameState.state.resources.operations.value) == -1) {
        return
    }

    GameState.state.dialogs.systemPick.show = true;

    let numOptions = 2;

    if (GameState.state.unlocks.extraSystemOption1)
        numOptions++;
    if (GameState.state.unlocks.extraSystemOption2)
        numOptions++;

    GameState.state.dialogs.systemPick.options = getServicePickOptions(numOptions)
}
GameLoop.registerEventListener("pick-system", openSystemPickDialog)

function deploySystem(event: GameEvent) {
    GameState.addService(event.data!["serviceId"] as string)

    GameState.state.dialogs.systemPick.show = false;
    GameState.state.dialogs.systemPick.options = [];

    GameLoop.updateUI();
}
GameLoop.registerEventListener("deploy-system", deploySystem)