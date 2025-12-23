# Effect Registry Documentation

The **Effect Registry** defines all trait effects in a modular, extensible way.  
Each effect is a **pure data definition + handler**, allowing traits to stack, combine, and be saved easily.

---

## Core Concepts

- **Effect**  
  A single, reusable modifier (e.g. +10% output, +instability per second).

- **Trait**  
  A collection of effects bundled together.

- **Registry**  
  Central lookup table for all effects by ID.

- **GameState**  
  Effects never mutate state directly; they are applied via controlled phases.

---

## Effect Definition

Each effect is registered under a unique ID.

```js
EffectRegistry.register({
  id: "output_multiplier",
  description: "Multiplies total output",
  type: "multiplier",
  target: "global",
  stackMode: "multiplicative",
  params: {
    multiplier: 1.2
  },
  apply(ctx) {
    ctx.output *= ctx.params.multiplier;
  }
});
```

---

## Effect Properties

### id (string, required)
Unique identifier for the effect.

```js
id: "output_multiplier"
```

Used for:
- Saving/loading
- Trait references
- Debug UI

---

### description (string)
Human-readable description.

```js
description: "Multiplies total output"
```

---

### type (string)
Logical category of the effect.

Common values:
- flat
- multiplier
- additive
- instability
- chance
- conditional

---

### target (string)
What the effect modifies.

Common values:
- global
- service
- subsystem
- instability
- output
- tick

---

### stackMode (string)
How multiple copies of the same effect stack.

| Mode | Behavior |
|------|----------|
| additive | Values sum |
| multiplicative | Values multiply |
| highest | Only highest value applies |
| unique | Only one allowed |

Example:
```js
stackMode: "additive"
```

---

### params (object)
Effect-specific parameters.

```js
params: {
  multiplier: 1.15,
  instabilityPerTick: 0.2
}
```

Params are serialized as-is.

---

### apply(ctx) (function)
Pure function that modifies a calculation context.

```js
apply(ctx) {
  ctx.output *= ctx.params.multiplier;
}
```

Must:
- Not mutate global state
- Only modify ctx

---

## Effect Context (ctx)

Context object passed to apply().

```js
{
  game,           // GameState reference (read-only)
  service,        // Owning service (optional)
  subsystem,      // Owning subsystem (optional)
  output,         // Current output value
  instability,    // Current instability value
  tickDelta,      // Time delta
  params          // Effect params
}
```

---

## Registry API

### EffectRegistry.register(effectDef)

Registers an effect.

```js
EffectRegistry.register(effectDef);
```

Throws if ID already exists.

---

### EffectRegistry.get(id)

Returns effect definition.

```js
const effect = EffectRegistry.get("output_multiplier");
```

---

### EffectRegistry.applyAll(effects, ctx)

Applies a list of effect instances.

```js
EffectRegistry.applyAll(service.effects, ctx);
```

Handles stacking rules internally.

---

## Effect Instance (Saved Data)

Traits store instances, not definitions.

```js
{
  effectId: "output_multiplier",
  params: {
    multiplier: 1.2
  },
  source: "Trait: Parallel Threads"
}
```

---

## Example Effect Types

### Flat Output Boost

```js
{
  id: "flat_output",
  type: "flat",
  stackMode: "additive",
  params: { amount: 5 },
  apply(ctx) {
    ctx.output += ctx.params.amount;
  }
}
```

---

### Instability Over Time

```js
{
  id: "instability_tick",
  type: "instability",
  stackMode: "additive",
  params: { perSecond: 0.3 },
  apply(ctx) {
    ctx.instability += ctx.params.perSecond * ctx.tickDelta;
  }
}
```

---

### Conditional Effect

```js
{
  id: "unstable_bonus",
  type: "conditional",
  stackMode: "multiplicative",
  params: { threshold: 50, multiplier: 2 },
  apply(ctx) {
    if (ctx.instability > ctx.params.threshold) {
      ctx.output *= ctx.params.multiplier;
    }
  }
}
```

---

## Design Rules

- Effects must be pure
- Effects must be stateless
- Effects must be serializable
- No effect may directly mutate GameState

---

## Why This Works for Likely Broken

- Random traits = random effect combinations
- Broken builds emerge naturally
- Systems remain debuggable
- Saving is trivial
- Future systems plug in cleanly
