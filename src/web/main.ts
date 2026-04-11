import { Controller } from './controller.js';
import { View } from './view.js';
import { PRESETS } from './presets.js';
import { encodeHash, decodeHash } from './url.js';

const container = document.getElementById('app')!;
const controller = new Controller();
const view = new View(container);

view.setPresets(PRESETS);

let lastGeneratedHash = '';

function updateHash(chords: string, key: string, mode: string): void {
    const hash = '#' + encodeHash(chords, key, mode);
    if (window.location.hash === hash) return;
    lastGeneratedHash = hash;
    window.location.hash = hash;
}

function loadFromHash(): boolean {
    const state = decodeHash(window.location.hash);
    if (!state) return false;
    (document.getElementById('chord-input') as HTMLInputElement).value = state.chords;
    (document.getElementById('key-select') as HTMLSelectElement).value = state.key;
    (document.getElementById('mode-select') as HTMLSelectElement).value = state.mode;
    controller.handleGenerate(state.chords, state.key, state.mode);
    lastGeneratedHash = window.location.hash;
    return true;
}

view.setOnGenerate((chords: string, tonic: string, mode: string) => {
    controller.handleGenerate(chords, tonic, mode);
    updateHash(chords, tonic, mode);
});

view.setOnPreset((chords: string, key: string, mode: string) => {
    controller.handleGenerate(chords, key, mode);
    updateHash(chords, key, mode);
});

controller.setOnPathsUpdate((matrix, paths, activePathIndex) => {
    view.render(matrix, paths, activePathIndex);
});

controller.setOnError((message: string) => {
    view.showError(message);
});

view.setOnCellClick((col: number, variantIndex: number) => {
    controller.handleCellClick(col, variantIndex);
});

view.setOnOptimalPath(() => {
    controller.handleShowOptimalPath();
});

view.setOnGreedyPath(() => {
    controller.handleShowGreedyPath();
});

view.setOnReset(() => {
    controller.handleReset();
});

loadFromHash();

window.addEventListener('hashchange', () => {
    if (window.location.hash === lastGeneratedHash) return;
    loadFromHash();
});
