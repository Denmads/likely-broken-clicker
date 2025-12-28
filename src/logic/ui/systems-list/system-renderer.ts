import { GameLoop } from "../../core";
import type { GameState } from "../../state"
import type { AddSystemView, SystemView } from "./system-view"
import { buildAddSystemView, buildSystemView } from "./system-view-builder"

const systemNodes = new Map<string, HTMLElement>()
let addSystemNode: HTMLElement | undefined;

export function renderSystems(state: GameState) {
  const container = document.querySelector(".systems-list")!
  let views = state.services.map(s => buildSystemView(s, state))

  if (!addSystemNode) {
    addSystemNode = createAddSystemNode()
    container.appendChild(addSystemNode!)
  }
  let addSystemView = buildAddSystemView(state)
  updateAddSystemNode(addSystemNode, addSystemView);

  let viewIds = views.map(v => v.id)
  for (let sysId in systemNodes) {
    if (!viewIds.includes(sysId)) {
        systemNodes.delete(sysId)
    }
  }

  for (const view of views) {
    let node = systemNodes.get(view.id)

    if (!node) {
      node = createSystemNode(view)
      systemNodes.set(view.id, node)
      container.insertBefore(node, addSystemNode!)
    }

    updateSystemNode(node, view)
  }
}

function createSystemNode(view: SystemView): HTMLElement {
  const el = document.createElement("div")
  el.className = "system-row"
  el.dataset.id = view.id

  el.innerHTML = `
        <div class="system-icon">${view.icon}</div>

        <div class="system-main">
            <div class="system-name">${view.name}</div>
            <div class="system-traits"></div>
        </div>

        <div class="system-metrics">
            <div class="metric output">
                <span class="metric-label">OUT</span>
                <span class="metric-value">12.4K</span>
            </div>
            <div class="metric instability">
                <span class="metric-label">INST</span>
                <span class="metric-value">38%</span>
            </div>
        </div>
  `

  return el
}

function updateSystemNode(el: HTMLElement, view: SystemView) {
  // name
  const name = el.querySelector(".system-name")!
  if (name.textContent !== view.name) {
    name.textContent = view.name
  }

  // icon
  el.querySelector(".system-icon")!.textContent = view.icon

  // output
  const out = el.querySelector(".metric.output .metric-value")!
  if (out.textContent !== view.outputText) {
    out.textContent = `${view.outputText} Ops/s`
  }

  // instability
  const inst = el.querySelector(".metric.instability")!
  inst.classList.toggle("warn", view.instabilityState === "warn")
  inst.classList.toggle("error", view.instabilityState === "error")
  inst.querySelector(".metric-value")!.textContent =
    `${view.instabilityPercent}%`

  // traits
  renderTraits(
    el.querySelector(".system-traits")!,
    view
  )
}

function renderTraits(container: HTMLElement, view: SystemView) {
  const existing = new Map<string, HTMLElement>()

  for (const child of Array.from(container.children)) {
    const id = (child as HTMLElement).dataset.id
    if (id) existing.set(id, child as HTMLElement)
  }

  container.innerHTML = ""

  for (const trait of view.traits) {
    let el = existing.get(trait.id)

    if (!el) {
      el = document.createElement("span")
      el.className = "trait"
      el.dataset.id = trait.id
    }

    el.textContent = trait.name
    el.classList.toggle("error", trait.severity === "error")

    container.appendChild(el)
  }

  if (view.addTrait.show) {
    let addTraitEl = document.createElement("button")
    addTraitEl.classList.toggle("disabled", view.addTrait.disable)

    container.appendChild(addTraitEl)
  }
}

function createAddSystemNode(): HTMLElement {
const el = document.createElement("button")
  el.className = "system-row system-unlock"

  el.innerHTML = `
    <div class="system-icon">+</div>

    <div class="system-main">
        <div class="system-name">
            DEPLOY NEW SYSTEM
        </div>
    </div>

    <div class="system-cost">
        <span class="cost-label">COST</span>
        <span class="cost-value">250K</span>
    </div>
  `

  el.addEventListener("click", () => {
    GameLoop.globalEmitEvent({
        type: "pick-system",
        time: performance.now(),
        source: {
            system: "player"
        }
    })
  })

  return el
}

function updateAddSystemNode(el: HTMLElement, view: AddSystemView) {
    let costEl: HTMLElement = el.querySelector(".cost-value")!
    costEl.innerText = view.cost
}