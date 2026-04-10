import { Controller } from './controller.js';
import { View } from './view.js';

const container = document.getElementById('app')!;
const controller = new Controller();
const view = new View(container);

view.setOnGenerate((chords: string, tonic: string, mode: string) => {
  controller.handleGenerate(chords, tonic, mode);
});

controller.setOnPathsUpdate((matrix, paths, activePathIndex) => {
  view.render(matrix, paths, activePathIndex);
});

controller.setOnError((message: string) => {
  view.showError(message);
});

view.setOnCellClick((col, variantIndex) => {
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
