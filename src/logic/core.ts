import { calculateServicedownTime, calculateServiceInstability, calculateServiceOutput } from './calculations';
import { EffectRegistry } from './effectRegistry';
import { LogarithmicValue } from './logarithmicValue';
import * as GameState from './state';
import { TraitRegistry } from './traitRegistry';
import type { EffectContext, GameEvent } from './types';
import { formatDuration } from './ui';

class GameLoop {
  private game!: GameState.GameState;
  private lastFrameTime!: number;
  private accumulatedDeltaTime!: number;

  constructor() {
    GameState.initialize();
    this.reset()
    this.addUIEventListeners()
  }

  reset() {
    this.game = GameState.state;
    this.lastFrameTime = performance.now();
    this.accumulatedDeltaTime = 0;
  }

  addUIEventListeners() {
    (document.querySelector(".manual-btn") as HTMLButtonElement).addEventListener("click", () => {
        this.game.resources.operations.value = this.game.resources.operations.value.add(LogarithmicValue.fromValue(1))
    })
  }

  start() {
    requestAnimationFrame(this.frame.bind(this));
  }

  private frame() {
    const now = performance.now();
    const deltaMs = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Run simulation ticks
    this.simulateTicks(deltaMs);

    // Update UI or animations separately
    this.updateUI(deltaMs);

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
      const ctx: EffectContext = {
        service,
        game: this.game,
        deltaTime: tickDelta,
        addModifier(mod) {
          
        },
        emitEvent(event) {
          GameLoop.globalEmitEvent(event, ctx.game);
        },
        hasTrait(id: string) {
          return service.traits.includes(id);
        },
        instability() {
          return service.totalInstability;
        }
      };

      for (const traitId of service.traits) {
        const traitDef = TraitRegistry[traitId];
        if (!traitDef) continue;
        
        
        for (const effect of traitDef.effects) {
            if (effect.type == "onTick")
                EffectRegistry["onTick"](ctx, effect)
        //   if (effect.type === "onTick" || effect.type === "outputAdditive" || effect.type === "instabilityAdditive") {
        //     EffectRegistry.apply(effect, ctx); // assumes you have EffectRegistry with apply()
        //   }
        }

        // Trait can listen to tick event
        // Assuming traits can have onEvent hooks
        // traitDef.onEvent?.({ type: "tick", time: this.game.meta.time, source: { serviceId: service.definition.id }, data: { delta: tickDelta } }, ctx);
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
  }

  private updateTotalOutput(tickDelta: number) {
    this.game.resources.operations.perSecond = this.game.services
        .map(s => s.totalOutput)
        .reduce((a, b) => a.add(b), LogarithmicValue.zero())

    let toAdd = this.game.resources.operations.perSecond.mul(tickDelta / 1000)
    this.game.resources.operations.value = this.game.resources.operations.value.add(toAdd)

    console.log(this.game.resources.operations.value.toFormattedString());
  }

  private emitEvent(event: GameEvent) {
    GameLoop.globalEmitEvent(event, this.game);
  }

  private updateUI(deltaTime: number) {
    // Decoupled UI updates
    (document.querySelector("#operations > .value") as HTMLSpanElement).innerText = this.game.resources.operations.value.toFormattedString();

    (document.querySelector(".info > #time") as HTMLParagraphElement).innerText = formatDuration(this.game.meta.time)
  }

  // Global event emitter
  static globalEmitEvent(event: GameEvent, game: GameState.GameState) {
    // Could notify all traits or global systems
    console.log("Global Event:", event.type, event.time.toFixed(1));
  }
}


export const loop = new GameLoop();
loop.start();