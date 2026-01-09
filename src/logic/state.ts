import { LogarithmicValue } from "./logarithmicValue";
import type { EffectContext, Modifier, ServiceId, ServiceState, ServiceStateSave, TraitId } from "./types"
import { ServiceRegistry } from "./serviceRegistry";
import { calculateServiceCost as calculateServiceCost, calculateTraitCost } from "./calculations";
import { TraitRegistry } from "./traitRegistry";

const GAME_STATE_VERSION = 1

interface GameStateSave {
    meta: {
        version: number,
        createdAt: number,
        lastSave: number,
        time: number; // seconds since start
        lastTickTime: number; // timestamp of last tick
        tickRate: number; // seconds per tick
    },

    resources: {
        operations: {
            value: number | null; // log_10(value)
            perSecond: number | null; // output per tick/sec
            perClick: number | null;
        }
        instability: {
            value: number | null; // log_10(value)
            perSecond: number | null; // output per tick/sec
        }
    },

    services: ServiceStateSave[],

    costs: {
        newServiceCost: number | null
    },

    dialogs: {
        systemPick: {
            show: boolean,
            options: ServiceId[]
        }
    },

    unlocks: {
        extraSystemOption1: boolean,
        extraSystemOption2: boolean,
        manualTraitChoice: boolean
    }
}


export type GameState = {
    meta: {
        version: number,
        createdAt: number,
        lastSave: number,
        time: number; // seconds since start
        lastTickTime: number; // timestamp of last tick
        tickRate: number; // seconds per tick
    },

    resources: {
        operations: {
            value: LogarithmicValue; // log_10(value)
            perSecond: LogarithmicValue; // output per tick/sec log_10(value)
            perClick: LogarithmicValue; 
        }
        instability: {
            value: LogarithmicValue; // log_10(value)
            perSecond: LogarithmicValue; // output per tick/sec log_10(value)
        }
    },

    services: ServiceState[],

    costs: {
        baseServiceCost: LogarithmicValue
    },

    dialogs: {
        systemPick: {
            show: boolean,
            options: ServiceId[]
        }
    },

    unlocks: {
        extraSystemOption1: boolean,
        extraSystemOption2: boolean,
        manualTraitChoice: boolean
    }
}

const SAVE_KEY = "local-save"
export let state: GameState

window.addEventListener("beforeunload", () => {
    saveState()
})

export function initialize() {
    loadState()
    setInterval(() => {
        saveState()
    }, 30_000)
}

export function saveState() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        meta: state.meta,
        resources: {
            operations: {
                value: state.resources.operations.value.log10Value,
                perSecond: state.resources.operations.perSecond.log10Value,
                perClick: state.resources.operations.perClick.log10Value
            },
            instability: {
                value: state.resources.instability.value.log10Value,
                perSecond: state.resources.instability.perSecond.log10Value
            }
        },
        services: state.services.map(s => ({
            ...s,
            definition: s.definition.id,
            purchaseCost: s.purchaseCost.log10Value,
            totalOutput: s.totalOutput.log10Value,
        })),
        costs: {
            newServiceCost: state.costs.baseServiceCost.log10Value
        },

        dialogs: state.dialogs,

        unlocks: state.unlocks
    } as GameStateSave))
    console.log("SAVED GAME");
}

export function loadState() {
    let loadedState = localStorage.getItem(SAVE_KEY)
    if (loadedState == null) {
        resetState();
        return;
    }

    let parsedState: GameStateSave = JSON.parse(loadedState)
    let hydratedState = {
        meta: parsedState.meta,
        resources: {
            operations: {
                value: new LogarithmicValue(parsedState.resources.operations.value),
                perSecond: new LogarithmicValue(parsedState.resources.operations.perSecond),
                perClick: new LogarithmicValue(parsedState.resources.operations.perClick)
            },
            instability: {
                value: new LogarithmicValue(parsedState.resources.instability.value),
                perSecond: new LogarithmicValue(parsedState.resources.instability.perSecond)
            }
        },
        services: parsedState.services.map(s => ({
            ...s,
            definition: ServiceRegistry[s.definition],
            purchaseCost: new LogarithmicValue(s.purchaseCost),
            totalOutput: new LogarithmicValue(s.totalOutput)
        })),
        costs: {
            baseServiceCost: new LogarithmicValue(parsedState.costs.newServiceCost)
        },

        dialogs: parsedState.dialogs,
        unlocks: parsedState.unlocks
    } as GameState


    state = migrateSave(hydratedState)
}

function migrateSave(state: GameState): GameState {
    return state
}

export function resetState() {
    localStorage.removeItem(SAVE_KEY);
    state = {
        meta: {
            version: GAME_STATE_VERSION,
            createdAt: new Date().getTime(),
            time: 0,
            lastSave: -1,
            lastTickTime: -1,
            tickRate: 1000 // 1 time a second
        },
        resources: {
            operations: {
                value: LogarithmicValue.zero(),
                perSecond: LogarithmicValue.zero(),
                perClick: LogarithmicValue.fromValue(1)
            },
            instability: {
                value: LogarithmicValue.zero(),
                perSecond: LogarithmicValue.zero()
            }
        },
        services: [],
        costs: {
            baseServiceCost: LogarithmicValue.fromValue(50)
        },

        dialogs: {
            systemPick: {
                show: false,
                options: []
            }
        },

        unlocks: {
            extraSystemOption1: false,
            extraSystemOption2: false,
            manualTraitChoice: false
        }
    } as GameState
    saveState();
}

export function addService(id: ServiceId, cost: LogarithmicValue) {
    state.services.push({
        definition: ServiceRegistry[id],
        purchaseCost: cost,
        activeModifiers: [],
        totalDowntime: 0,
        totalInstability: 0,
        totalOutput: LogarithmicValue.zero(),
        traits: []
    })
}

export function addTrait(serviceId: ServiceId, traitId: TraitId) {
    let service = state.services.find(s => s.definition.id == serviceId)!
    service.traits.push(traitId);

    var traitDefinition = TraitRegistry[traitId]
    
    if ("onAttach" in traitDefinition.effects) {
        var context = createEffectContext(service)
        traitDefinition.effects["onAttach"]!(context)
    }
}

export function getCurrentServiceCost(): LogarithmicValue {
    let baseCost = state.costs.baseServiceCost;

    let n = state.services.length
    return calculateServiceCost(n, baseCost)
}

export function getCurrentTraitCostForService(id: ServiceId): LogarithmicValue {
    let serviceState = state.services.find(s => s.definition.id == id)!

    let n = serviceState.traits.length;
    return calculateTraitCost(n, serviceState.purchaseCost.mul(0.7), serviceState.totalInstability)
}

export function createEffectContext(service: ServiceState): EffectContext {
    return {
        service,
        state,
        addModifier: (mod) => service.activeModifiers.push(mod)
    }
}