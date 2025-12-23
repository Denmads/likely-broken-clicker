import type { Modifier } from "./types";

export function resolveModifiers(base: number, mods: Modifier[]) {
  let value = base;

  mods.filter(m => m.type === "add")
      .forEach(m => value += m.value);

  mods.filter(m => m.type === "mul")
      .forEach(m => value *= m.value);

  return Math.max(0, value);
}