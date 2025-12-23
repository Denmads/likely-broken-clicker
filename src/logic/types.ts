import type { LogarithmicValue } from "./logarithmicValue";
import type { GameState } from "./state";

export type LogValue = number | null;

export type ServiceId = string;

export interface ServiceDefinition {
    id: ServiceId,
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
    outputAdd: LogarithmicValue,
    outputMul: LogarithmicValue,
    totalOutput: LogarithmicValue, //computed
    instabilityAdd: number,
    instabilityMul: number,
    totalInstability: number, //computed
    downtimePercentageReduction:number,
    totalDowntime: number, //computed
    activeModifiers: Modifier[],
    traits: TraitId[]
}

export interface ServiceStateSave {
    definition: ServiceDefinition,
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

    maxStacks?: number;

  effects: TraitEffectDefinition[];
}

export interface TraitEffectDefinition {
  type: EffectType;
  params: Record<string, number | string | boolean>;
}

export type EffectHandler = (
  ctx: EffectContext,
  params: any
) => void;

export interface EffectContext {
  service: ServiceState;
  game: GameState;
  deltaTime: number;

  addModifier(mod: Modifier): void;
  emitEvent(event: GameEvent): void;
  hasTrait(id: string): boolean;
  instability(): number;
}

export interface Modifier {
  target: "output" | "instability" | "cooldown";
  type: "add" | "mul";
  value: number;
  source: TraitId;
}

export type EffectType =
  | "onAttach"
  | "onDetach"
  | "onTick"
  | "outputMultiplier"
  | "outputAdditive"
  | "instabilityAdditive"
  | "instabilityOverTime"
  | "instabilityMultiplier"
  | "onFailure"
  | "onOtherServiceFailure"
  | "suppressTraitTag"
  | "chanceBasedBoost";

export interface GameEvent {
  type: string
  time: number
  source?: EventSource
  data?: Record<string, number | string | boolean>
}

export interface EventSource {
  serviceId?: string
  subsystemId?: string
  traitId?: string
  system?: "player" | "engine"
}