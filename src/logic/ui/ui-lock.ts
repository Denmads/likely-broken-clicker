let uiLocked = false;
const listeners: Array<(locked: boolean) => void> = [];

export function isUiLocked() {
    return uiLocked;
}

export function setUiLocked(locked: boolean) {
    if (uiLocked === locked) {
        return;
    }

    uiLocked = locked;
    listeners.forEach(listener => listener(uiLocked));
}

export function onUiLockChange(listener: (locked: boolean) => void) {
    listeners.push(listener);
}
