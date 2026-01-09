import { GameLoop } from "./core";
import type { GameEvent } from "./types";
import * as GameState from './state';
import { getServicePickOptions } from "./serviceRegistry";
import { getTraitPickOptionsForService } from "./traitRegistry";

function openSystemPickDialog(event: GameEvent) {
    if (GameState.state.dialogs.systemPick.show) {
        return;
    }

    let serviceCost = GameState.getCurrentServiceCost();
    if (serviceCost.compare(GameState.state.resources.operations.value) == -1) {
        return
    }

    let numOptions = 2;

    if (GameState.state.unlocks.extraSystemOption1)
        numOptions++;
    if (GameState.state.unlocks.extraSystemOption2)
        numOptions++;

    let options = getServicePickOptions(numOptions)
    
    if (options.length == 0) {
        return;
    }

    GameState.state.dialogs.systemPick.show = true;
    GameState.state.dialogs.systemPick.options = options

    GameLoop.updateUI();
}
GameLoop.registerEventListener("pick-system", openSystemPickDialog)

function deploySystem(event: GameEvent) {
    GameState.addService(event.data!["serviceId"] as string, GameState.getCurrentServiceCost())

    GameState.state.resources.operations.value = GameState.state.resources.operations.value.sub(GameState.getCurrentServiceCost())
    GameState.state.dialogs.systemPick.show = false;
    GameState.state.dialogs.systemPick.options = [];

    GameLoop.updateUI();
}
GameLoop.registerEventListener("deploy-system", deploySystem)

function addTrait(event: GameEvent) {
    let serviceId = event.data!["serviceId"] as string

    let options = getTraitPickOptionsForService(serviceId)
    if (options.length == 0) {
        return
    } 

    GameState.state.resources.operations.value = GameState.state.resources.operations.value.sub(GameState.getCurrentTraitCostForService(serviceId))

    if (GameState.state.unlocks.manualTraitChoice) {
        // TODO: Implement
    }
    else {
        let option = options[Math.floor(Math.random() * options.length)]

        GameState.addTrait(serviceId, option)
        GameLoop.updateUI();
    }
}
GameLoop.registerEventListener("add-trait", addTrait)