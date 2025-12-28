export interface SystemView {
  id: string
  name: string
  icon: string

  outputText: string
  instabilityPercent: number
  instabilityState: "ok" | "warn" | "error"

  traits: TraitView[]

  addTrait: {
    show: boolean
    disable: boolean
  }
}

export interface TraitView {
  id: string
  name: string
  severity: "normal" | "warn" | "error"
}

export interface AddSystemView {
    cost: string
}