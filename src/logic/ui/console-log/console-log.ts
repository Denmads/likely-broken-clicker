import * as GameState from "../../state";
import { formatClockTime } from "../../ui-util";
import type { LogEntry } from "../../types";
import { MAX_LOG_ENTRIES } from "../../types";
import { setUiLocked } from "../ui-lock";

const LOG_SCROLL_MARGIN = 8;

let cachedContainer: HTMLElement | null = null;
let bootSequenceRunning = false;

function getContainer(): HTMLElement | null {
    if (cachedContainer && cachedContainer.isConnected) {
        return cachedContainer;
    }

    cachedContainer = document.querySelector(".console-log-lines");
    return cachedContainer;
}

function createLineElement(entry: LogEntry): HTMLElement {
    const line = document.createElement("div");
    line.className = "console-log-line";

    const time = document.createElement("span");
    time.className = "console-log-time";
    time.textContent = formatClockTime(entry.time);

    const text = document.createElement("span");
    text.className = "console-log-text";
    text.textContent = entry.text;

    line.append(time, text);
    return line;
}

function getLogEntries(): LogEntry[] {
    if (!GameState.state) {
        return [];
    }

    if (!GameState.state.logs) {
        GameState.state.logs = [];
    }

    return GameState.state.logs;
}

export function renderConsoleLog() {
    const container = getContainer();
    if (!container) {
        return;
    }

    container.innerHTML = "";
    for (const entry of getLogEntries()) {
        container.appendChild(createLineElement(entry));
    }

    container.scrollTop = container.scrollHeight + LOG_SCROLL_MARGIN;
}

export function clearConsoleLog() {
    getLogEntries().length = 0;

    const container = getContainer();
    if (container) {
        container.innerHTML = "";
    }
}

export function appendLogLine(text: string, time = Date.now()) {
    const entry = { time, text } as LogEntry;
    const logEntries = getLogEntries();
    logEntries.push(entry);

    let trimmed = false;
    if (logEntries.length > MAX_LOG_ENTRIES) {
        logEntries.splice(0, logEntries.length - MAX_LOG_ENTRIES);
        trimmed = true;
    }

    const container = getContainer();
    if (!container) {
        return;
    }

    if (trimmed) {
        renderConsoleLog();
        return;
    }

    container.appendChild(createLineElement(entry));
    container.scrollTop = container.scrollHeight + LOG_SCROLL_MARGIN;
}

export function startBootSequenceIfNeeded() {
    if (bootSequenceRunning || GameState.state.meta.bootCompleted) {
        return;
    }

    bootSequenceRunning = true;
    clearConsoleLog();
    setUiLocked(true);

    const sequence = [
        { delay: 0, text: "Boot sequence start." },
        { delay: 800, text: "Loading core services..." },
        { delay: 1700, text: "Linking power and data lanes." },
        { delay: 2800, text: "Rebuilding unstable caches." },
        { delay: 3900, text: "Warming monitors and telemetry." },
        { delay: 4800, text: "System online." }
    ];

    sequence.forEach(item => {
        window.setTimeout(() => {
            appendLogLine(item.text);
        }, item.delay);
    });

    window.setTimeout(() => {
        GameState.state.meta.bootCompleted = true;
        GameState.saveState();
        setUiLocked(false);
        bootSequenceRunning = false;
    }, 5200);
}
