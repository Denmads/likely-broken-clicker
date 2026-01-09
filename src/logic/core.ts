import { calculateServicedownTime, calculateServiceInstability, calculateServiceOutput } from './calculations';
// import { EffectRegistry } from './effectRegistry';
import { LogarithmicValue } from './logarithmicValue';
import * as GameState from './state';
import { TraitRegistry } from './traitRegistry';
import type { EffectContext, EventType, GameEvent, GameEventListener } from './types';
import { formatDuration } from './ui-util';
import { renderSystemPickDialog } from './ui/system-pick-dialog/system-pick-renderer';
import { renderSystems } from './ui/systems-list/system-renderer';

export class GameLoop {
  private game!: GameState.GameState;
  private lastFrameTime!: number;
  private accumulatedDeltaTime!: number;

  private rerender!: boolean;

  private static eventListeners: {[key in EventType]?: GameEventListener[]} = {}

  constructor() {
    GameState.initialize();
    this.reset()
    this.addUIEventListeners()
  }

  reset() {
    this.rerender = true;
    this.game = GameState.state;
    this.lastFrameTime = performance.now();
    this.accumulatedDeltaTime = 0;
  }

  addUIEventListeners() {
    (document.querySelector(".manual-btn") as HTMLButtonElement).addEventListener("click", () => {
        this.game.resources.operations.value = this.game.resources.operations.value.add(this.game.resources.operations.perClick)
    })
  }

  start() {
    this.rerender = true;
    this.updateUICheck(0);
    requestAnimationFrame(this.frame.bind(this));
  }

  private frame() {
    const now = performance.now();
    const deltaMs = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Run simulation ticks
    this.simulateTicks(deltaMs);

    // Update UI or animations separately
    this.updateUICheck(deltaMs);

    requestAnimationFrame(this.frame.bind(this));
  }

  private simulateTicks(deltaTime: number) {
    this.accumulatedDeltaTime += deltaTime;
    while (this.accumulatedDeltaTime >= this.game.meta.tickRate) {
      this.tick(this.game.meta.tickRate);
      this.accumulatedDeltaTime -= this.game.meta.tickRate;
    }
  }

  private tick(tickDelta: number) {
    this.game.meta.time += tickDelta / 1000;
    this.game.meta.lastTickTime = this.lastFrameTime

    for (const service of this.game.services) {

        let ctx = GameState.createEffectContext(service)

      for (const traitId of service.traits) {
        const traitDef = TraitRegistry[traitId];
        if (!traitDef) continue;
        
        if ("onTick" in traitDef.effects) {
            traitDef.effects["onTick"]!(ctx)
        }
      }

      service.totalOutput = calculateServiceOutput(service)
      service.totalInstability = calculateServiceInstability(service)
      service.totalDowntime = calculateServicedownTime(service)

      // Example output generation
    //   service.baseOutput += 1 * tickDelta; // base generation
    //   service.instability += 0.01 * tickDelta; // base instability
    }

    this.updateTotalOutput(tickDelta)
    

    // Global tick event
    this.emitEvent({ type: "tick", time: this.game.meta.time });
    this.rerender = true;
  }

  private updateTotalOutput(tickDelta: number) {
    this.game.resources.operations.perSecond = this.game.services
        .map(s => s.totalOutput)
        .reduce((a, b) => a.add(b), LogarithmicValue.zero())

    let toAdd = this.game.resources.operations.perSecond.mul(tickDelta / 1000)
    this.game.resources.operations.value = this.game.resources.operations.value.add(toAdd)
  }

  private emitEvent(event: GameEvent) {
    GameLoop.globalEmitEvent(event);
  }

  private updateUICheck(deltaTime: number) {
    // Decoupled UI updates

    if (this.rerender) {
        this.rerender = false;

        GameLoop.updateUI();
    }

    (document.querySelector("#operations > .value") as HTMLSpanElement).innerText = GameState.state.resources.operations.value.toFormattedString();
    (document.querySelector("#operations-per-second > .value") as HTMLSpanElement).innerText = GameState.state.resources.operations.perSecond.toFormattedString();
    (document.querySelector("#operations-per-click > .value") as HTMLSpanElement).innerText = GameState.state.resources.operations.perClick.toFormattedString();

    (document.querySelector(".info > #time") as HTMLParagraphElement).innerText = formatDuration(GameState.state.meta.time)
  }

  static updateUI() {
        renderSystems(GameState.state);
        renderSystemPickDialog(GameState.state);
  }

  // Global event emitter
  static globalEmitEvent(event: GameEvent) {
    // Could notify all traits or global systems
    console.log("Global Event:", event.type, event.time.toFixed(1));

    let listeners = this.eventListeners[event.type]

    if (!listeners) {
        this.eventListeners[event.type] = []
        return;
    }

    if (listeners.length > 0) {
        listeners.forEach(listener => listener(event))
    }
  }

  static registerEventListener(type: EventType, callback: GameEventListener) {
    if (!this.eventListeners[type]) {
        this.eventListeners[type] = []
    }

    this.eventListeners[type].push(callback)
  }
}


export const loop = new GameLoop();
loop.start();