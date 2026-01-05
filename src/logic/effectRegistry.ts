// import type { EffectContext, EffectHandler, EffectType } from "./types";

// export const EffectRegistry: Record<EffectType, EffectHandler> = {

//   // ─────────────────────────────────────────────
//   // Lifecycle
//   // ─────────────────────────────────────────────

//   onAttach(ctx: EffectContext, params) {
//     if (params.instability) {
//       ctx.addModifier({
//         target: "instability",
//         type: "add",
//         value: params.instability,
//         source: "onAttach"
//       });
//     }
//   },

//   onDetach(ctx: EffectContext, params) {
//     // if (params.cleanupEvent) {
//     //   ctx.emitEvent({ type: params.cleanupEvent as string, time: new Date().getTime() });
//     // }
//   },

//   // ─────────────────────────────────────────────
//   // Output
//   // ─────────────────────────────────────────────

//   outputMultiplier(ctx: EffectContext, params) {
//     ctx.addModifier({
//       target: "output",
//       type: "mul",
//       value: params.value,
//       source: "trait"
//     });
//   },

//   outputAdditive(ctx: EffectContext, params) {
//     ctx.addModifier({
//       target: "output",
//       type: "add",
//       value: params.value,
//       source: "trait"
//     });
//   },

//   // ─────────────────────────────────────────────
//   // Instability
//   // ─────────────────────────────────────────────

//   instabilityAdditive(ctx: EffectContext, params) {
//     ctx.addModifier({
//       target: "instability",
//       type: "add",
//       value: params.value,
//       source: "trait"
//     });
//   },

//   instabilityMultiplier(ctx: EffectContext, params) {
//     ctx.addModifier({
//       target: "instability",
//       type: "mul",
//       value: params.value,
//       source: "trait"
//     });
//   },

//   instabilityOverTime(ctx: EffectContext, params) {
//     ctx.addModifier({
//       target: "instability",
//       type: "add",
//       value: params.rate * ctx.deltaTime,
//       source: "instabilityOverTime"
//     });
//   },

//   // ─────────────────────────────────────────────
//   // Tick-based / probabilistic
//   // ─────────────────────────────────────────────

//   onTick(ctx: EffectContext, params) {
//     if (params.instabilityGain) {
//       ctx.addModifier({
//         target: "instability",
//         type: "add",
//         value: params.instabilityGain * ctx.deltaTime,
//         source: "onTick"
//       });
//     }

//     if (params.outputPulse && Math.random() < params.chance) {
//       ctx.addModifier({
//         target: "output",
//         type: "mul",
//         value: params.outputPulse,
//         source: "onTickPulse"
//       });
//     }
//   },

//   chanceBasedBoost(ctx: EffectContext, params) {
//     const chance =
//       params.baseChance +
//       ctx.instability() * (params.instabilityScaling ?? 0);

//     if (Math.random() < chance) {
//       ctx.addModifier({
//         target: params.target,
//         type: params.mode ?? "mul",
//         value: params.value,
//         source: "chanceBoost"
//       });
//     }
//   },

//   // ─────────────────────────────────────────────
//   // Failure & Chaos
//   // ─────────────────────────────────────────────

//   onFailure(ctx: EffectContext, params) {
//     if (params.outputPenalty) {
//       ctx.addModifier({
//         target: "output",
//         type: "mul",
//         value: params.outputPenalty,
//         source: "failure"
//       });
//     }

//     if (params.emitEvent) {
//       ctx.emitEvent({ type: "system-failure", time: new Date().getTime() });
//     }

//     if (params.spreadInstability) {
//       ctx.game.services.forEach(s => {
//         if (s !== ctx.service) {
//         //   s.instability += params.spreadInstability;
//         }
//       });
//     }
//   },

//   onOtherServiceFailure(ctx: EffectContext, params) {
//     if (Math.random() < params.chance) {
//       ctx.addModifier({
//         target: "output",
//         type: "mul",
//         value: params.value,
//         source: "cascadeFailure"
//       });
//     }
//   },

//   // ─────────────────────────────────────────────
//   // Suppression / Control
//   // ─────────────────────────────────────────────

//   suppressTraitTag(ctx: EffectContext, params) {
//     // ctx.service.suppressedTags.add(params.tag);
//   }
// };
