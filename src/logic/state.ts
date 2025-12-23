import { LogarithmicValue } from "./logarithmicValue";
import type { ServiceState, ServiceStateSave } from "./types"

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
        }
        instability: {
            value: number | null; // log_10(value)
            perSecond: number | null; // output per tick/sec
        }
    },

    services: ServiceStateSave[]
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
        }
        instability: {
            value: LogarithmicValue; // log_10(value)
            perSecond: LogarithmicValue; // output per tick/sec log_10(value)
        }
    },

    services: ServiceState[]
}

const SAVE_KEY = "local-save"
export let state: GameState

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
                perSecond: state.resources.operations.perSecond.log10Value
            },
            instability: {
                value: state.resources.instability.value.log10Value,
                perSecond: state.resources.instability.perSecond.log10Value
            }
        },
        services: state.services.map(s => ({
            ...s,
            outputAdd: s.outputAdd.log10Value,
            outputMul: s.outputMul.log10Value,
            totalOutput: s.totalOutput.log10Value,
        }))
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
                perSecond: new LogarithmicValue(parsedState.resources.operations.perSecond)
            },
            instability: {
                value: new LogarithmicValue(parsedState.resources.instability.value),
                perSecond: new LogarithmicValue(parsedState.resources.instability.perSecond)
            }
        },
        services: parsedState.services.map(s => ({
            ...s,
            outputAdd: new LogarithmicValue(s.outputAdd),
            outputMul: new LogarithmicValue(s.outputMul),
            totalOutput: new LogarithmicValue(s.totalOutput)
        }))
    } as GameState


    state = migrateSave(hydratedState)
}

function migrateSave(state: GameState): GameState {
    return state
}

export function resetState() {
    state = {
        meta: {
            version: GAME_STATE_VERSION,
            createdAt: performance.now(),
            time: 0,
            lastSave: -1,
            lastTickTime: -1,
            tickRate: 1000 // 1 time a second
        },
        resources: {
            operations: {
                value: LogarithmicValue.zero(),
                perSecond: LogarithmicValue.zero()
            },
            instability: {
                value: LogarithmicValue.zero(),
                perSecond: LogarithmicValue.zero()
            }
        },
        services: []
    } as GameState
    saveState();
}