import { GameLoop } from "../../core";
import type { GameState } from "../../state"
import type { SystemPickOptionView } from "./system-pick-view";
import { buildSystemPickView } from "./system-pick-view-builder"

let systemPickDialogNode: HTMLDivElement | undefined;

export function renderSystemPickDialog(state: GameState) {
  let view = buildSystemPickView(state)

  if (!systemPickDialogNode) {
    systemPickDialogNode = createSystemPickDialogNode()
    document.body.appendChild(systemPickDialogNode!)
  }

  systemPickDialogNode.classList.toggle("show", view.show)

  const optionContainer = systemPickDialogNode.querySelector(".system-pick-grid")!
  const optionIds = view.options.map(o => o.id)
  const existingOptions = []
  for (const child of Array.from(optionContainer.children)) {
    const id = (child as HTMLElement).dataset.id
    if (!id) continue

    if (!optionIds.includes(id))
        child.remove()
    else
        existingOptions.push(id)
  }

  for (let optionView of view.options) {
    if (existingOptions.includes(optionView.id)) continue

    addOption(optionContainer as HTMLElement, optionView)
  }
}

function createSystemPickDialogNode() {
    const el = document.createElement("div")
    el.className = "system-pick-backdrop"

    el.innerHTML = `
            <div class="system-pick-dialog">
                <header class="system-pick-header">
                    <h2>Choose a New System</h2>
                    <p>Each system has strengths… and problems.</p>
                </header>

                <div class="system-pick-grid"></div>

                <footer class="system-pick-footer">
                    <p>Pick wisely. Systems are permanent.</p>
                </footer>
            </div>
    `

    return el
}

function addOption(container: HTMLElement, optionView: SystemPickOptionView) {

    const el = document.createElement("button")
    el.className = "system-card"
    el.dataset.id = optionView.id

    let instabilityText = optionView.baseInstabilityLevel[0].toUpperCase() + optionView.baseInstabilityLevel.slice(1);

    el.innerHTML = `
        <div class="system-card-header">
            <div class="system-icon">${optionView.icon}</div>
            <div class="system-title">
                <h3>${optionView.name}</h3>
            </div>
        </div>

        <p class="system-description">
            ${optionView.description}
        </p>

        <ul class="system-stats">
            <li>
                <span class="label">Base Output</span>
                <span class="value">${optionView.baseOutput} Ops/s</span>
            </li>
            <li>
                <span class="label">Instability</span>
                <span class="value ${optionView.baseInstabilityLevel}">${instabilityText}</span>
            </li>
            <li>
                <span class="label">Downtime</span>
                <span class="value medium">${optionView.baseDowntime}s</span>
            </li>
        </ul>
    `

    container.appendChild(el)

    el.addEventListener("click", () => {
        GameLoop.globalEmitEvent({
            type: "deploy-system",
            time: performance.now(),
            source: {
                system: "player"
            },
            data: {
                "serviceId": optionView.id
            }
        })
    })
}