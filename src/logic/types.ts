import type { LogarithmicValue } from "./logarithmicValue";
import type { GameState } from "./state";

export type LogValue = number | null;

export type ServiceId = string;

export interface ServiceDefinition {
    id: ServiceId,
    icon: string,
    displayName: string,
    description: string,
    maxTraits: number,
    baseOutput: LogarithmicValue,
    baseInstability: number,
    baseDowntime: number,
    availableTraits: TraitId[]
}

export interface ServiceState {
    definition: ServiceDefinition,
    purchaseCost: LogarithmicValue,
    totalOutput: LogarithmicValue, //computed
    totalInstability: number, //computed
    totalDowntime: number, //computed
    activeModifiers: Modifier[],
    traits: TraitId[]
}

export interface ServiceStateSave {
    definition: ServiceId,
    purchaseCost: number | null,
    outputAdd: number | null,
    outputMul: number | null,
    totalOutput: number | null, //computed
    instabilityAdd: number,
    instabilityMul: number,
    totalInstability: number, //computed
    downtimePercentageReduction:number,
    totalDowntime: number, //computed
    activeModifiers: Modifier[],
    traits: TraitId[]
}

export type TraitId = string;
export type TraitTag = string;

export interface TraitDefinition {
    id: TraitId;
    name: string;
    description: string;

    rarity: "common" | "uncommon" | "rare" | "cursed";
    tags: TraitTag[];

  effects: { [key in EffectTriggerType]?: EffectHandler };
}

// export interface TraitEffectDefinitionOld {
//   type: EffectType;
//   params: Record<string, number | string | boolean>;
// }

// export interface TraitEffectDefinition {
//   trigger: EffectTriggerType[];
//   action: EffectHandler;
// }

export type EffectTriggerType =
  | "onAttach"
  | "onDetach"
  | "onTick"
  | "onSelfFailure"
  | "onOtherFailure";



export type EffectHandler = (
  ctx: EffectContext
) => void;

export interface EffectContext {
  service: ServiceState;
  state: GameState;

  addModifier(mod: Modifier): void;
}

export interface Modifier {
  target: "output" | "instability" | "cooldown";
  type: "add" | "mul";
  value: LogarithmicValue;
  source: TraitId;
}

// export type EffectType =
//   | "onAttach"
//   | "onDetach"
//   | "onTick"
//   | "outputMultiplier"
//   | "outputAdditive"
//   | "instabilityAdditive"
//   | "instabilityOverTime"
//   | "instabilityMultiplier"
//   | "onFailure"
//   | "onOtherServiceFailure"
//   | "suppressTraitTag"
//   | "chanceBasedBoost";

export interface GameEvent {
  type: EventType
  time: number
  source?: EventSource
  data?: Record<string, number | string | boolean>
}

export type EventType =
    | "tick"
    | "system-failure"
    | "pick-system"
    | "deploy-system"
    | "add-trait";

export interface EventSource {
  serviceId?: string
  subsystemId?: string
  traitId?: string
  system?: "player" | "engine"
}

export type GameEventListener = (event: GameEvent) => void