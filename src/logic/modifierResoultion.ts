import type { Modifier } from "./types";

export function resolveModifiers(base: number, mods: Modifier[]) {
  let value = base;

  mods.filter(m => m.type === "add")
      .forEach(m => value += m.value.rawValue);

  mods.filter(m => m.type === "mul")
      .forEach(m => value *= m.value.rawValue);

  return Math.max(0, value);
}