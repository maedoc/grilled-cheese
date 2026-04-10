import { PITCH_CLASS_SHARPS } from '../lib/index.js';
import type {
  VoiceLeadingMatrix,
  VoiceLeadingPath,
  MatrixColumn,
  ChordVariant,
} from '../lib/index.js';

interface CellElements {
  [key: string]: HTMLElement;
}

const BADGE_LABELS: Record<string, string> = {
  'tritone-substitute': 'sub',
  'dim7-equivalent': 'dim',
  'm6-on-fifth': 'm6/5',
  'm6-enharmonic': 'm6',
  'm7-sus-substitute': 'sus',
  'm7-on-fifth': 'm7/5',
  'augmented-dominant': 'aug',
  'relative-major6': 'M6',
  'relative-major7': 'maj7',
  'relative-minor6': 'm6',
  'iii-for-I': 'iii',
  'vi9-for-I': 'vi9',
  'm6-on-third': 'm6/3',
  'halfdim-to-m6': 'm6',
  'halfdim-to-m7': 'm7',
};

export class View {
  private container: HTMLElement;
  private cells: CellElements = {};
  private pathRowCells: HTMLElement[][] = [];
  private tooltip: HTMLElement | null = null;
  private onCellClick: ((col: number, variantIndex: number) => void) | null = null;
  private onOptimalPath: (() => void) | null = null;
  private onGreedyPath: (() => void) | null = null;
  private onReset: (() => void) | null = null;
  private onGenerate:
    | ((chords: string, tonic: string, mode: string) => void)
    | null = null;
  private currentGrid: HTMLElement | null = null;
  private currentNumCols = 0;
  private resizeHandler: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.buildInitialDOM();
    this.resizeHandler = () => this.updateGridTemplate();
    window.addEventListener('resize', this.resizeHandler);
  }

  setOnCellClick(handler: (col: number, variantIndex: number) => void): void {
    this.onCellClick = handler;
  }

  setOnOptimalPath(handler: () => void): void {
    this.onOptimalPath = handler;
  }

  setOnGreedyPath(handler: () => void): void {
    this.onGreedyPath = handler;
  }

  setOnReset(handler: () => void): void {
    this.onReset = handler;
  }

  setOnGenerate(
    handler: (chords: string, tonic: string, mode: string) => void,
  ): void {
    this.onGenerate = handler;
  }

  private buildInitialDOM(): void {
    this.container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'header';
    const h1 = document.createElement('h1');
    h1.textContent = 'Voice Leading Matrix';
    const p = document.createElement('p');
    p.textContent = 'Explore smooth voice leading between chord voicings';
    header.appendChild(h1);
    header.appendChild(p);

    const inputPanel = document.createElement('div');
    inputPanel.className = 'input-panel';

    const chordGroup = document.createElement('div');
    chordGroup.className = 'input-group';
    const chordLabel = document.createElement('label');
    chordLabel.textContent = 'Chord Progression';
    chordLabel.setAttribute('for', 'chord-input');
    const chordInput = document.createElement('input');
    chordInput.id = 'chord-input';
    chordInput.type = 'text';
    chordInput.placeholder = 'Dm7 G7 Cmaj7';
    chordInput.spellcheck = false;
    chordGroup.appendChild(chordLabel);
    chordGroup.appendChild(chordInput);

    const keyGroup = document.createElement('div');
    keyGroup.className = 'input-group';
    const keyLabel = document.createElement('label');
    keyLabel.textContent = 'Key';
    keyLabel.setAttribute('for', 'key-select');
    const keySelect = document.createElement('select');
    keySelect.id = 'key-select';
    const keys = [
      'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F',
      'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
    ];
    for (const k of keys) {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = k;
      keySelect.appendChild(opt);
    }
    keyGroup.appendChild(keyLabel);
    keyGroup.appendChild(keySelect);

    const modeGroup = document.createElement('div');
    modeGroup.className = 'input-group';
    const modeLabel = document.createElement('label');
    modeLabel.textContent = 'Mode';
    modeLabel.setAttribute('for', 'mode-select');
    const modeSelect = document.createElement('select');
    modeSelect.id = 'mode-select';
    const majorOpt = document.createElement('option');
    majorOpt.value = 'major';
    majorOpt.textContent = 'major';
    const minorOpt = document.createElement('option');
    minorOpt.value = 'minor';
    minorOpt.textContent = 'minor';
    modeSelect.appendChild(majorOpt);
    modeSelect.appendChild(minorOpt);
    modeGroup.appendChild(modeLabel);
    modeGroup.appendChild(modeSelect);

    const generateBtn = document.createElement('button');
    generateBtn.id = 'generate-btn';
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = 'Generate';
    generateBtn.addEventListener('click', () => {
      const chords = (
        document.getElementById('chord-input') as HTMLInputElement
      ).value;
      const tonic = (document.getElementById('key-select') as HTMLSelectElement)
        .value;
      const mode = (
        document.getElementById('mode-select') as HTMLSelectElement
      ).value;
      if (this.onGenerate) {
        this.onGenerate(chords, tonic, mode);
      }
    });

    const pathControls = document.createElement('div');
    pathControls.className = 'path-controls';

    const optimalBtn = document.createElement('button');
    optimalBtn.id = 'optimal-btn';
    optimalBtn.className = 'btn-secondary';
    optimalBtn.textContent = 'Show Optimal Path';
    optimalBtn.disabled = true;
    optimalBtn.addEventListener('click', () => this.onOptimalPath?.());

    const greedyBtn = document.createElement('button');
    greedyBtn.id = 'greedy-btn';
    greedyBtn.className = 'btn-secondary';
    greedyBtn.textContent = 'Show Greedy Path';
    greedyBtn.disabled = true;
    greedyBtn.addEventListener('click', () => this.onGreedyPath?.());

    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-btn';
    resetBtn.className = 'btn-secondary';
    resetBtn.textContent = 'Reset';
    resetBtn.disabled = true;
    resetBtn.addEventListener('click', () => this.onReset?.());

    pathControls.appendChild(optimalBtn);
    pathControls.appendChild(greedyBtn);
    pathControls.appendChild(resetBtn);

    inputPanel.appendChild(chordGroup);
    inputPanel.appendChild(keyGroup);
    inputPanel.appendChild(modeGroup);
    inputPanel.appendChild(generateBtn);
    inputPanel.appendChild(pathControls);

    const matrixArea = document.createElement('div');
    matrixArea.id = 'matrix-area';

    const legend = document.createElement('div');
    legend.className = 'legend';
    legend.id = 'legend';

    const matrixWrapper = document.createElement('div');
    matrixWrapper.className = 'matrix-wrapper';
    matrixWrapper.id = 'matrix-wrapper';

    const pathPanel = document.createElement('div');
    pathPanel.className = 'path-panel';
    pathPanel.id = 'path-panel';
    pathPanel.style.display = 'none';

    matrixArea.appendChild(legend);
    matrixArea.appendChild(matrixWrapper);
    matrixArea.appendChild(pathPanel);
    matrixArea.style.display = 'none';

    this.container.appendChild(header);
    this.container.appendChild(inputPanel);
    this.container.appendChild(matrixArea);

    this.createTooltip();
  }

  private createTooltip(): void {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.style.display = 'none';
    document.body.appendChild(this.tooltip);
  }

  render(
    matrix: VoiceLeadingMatrix,
    paths: VoiceLeadingPath[],
    activePathIndex: number,
  ): void {
    this.cells = {};
    this.pathRowCells = [];

    const matrixArea = document.getElementById('matrix-area')!;
    matrixArea.style.display = 'block';

    const legend = document.getElementById('legend')!;
    legend.innerHTML = '';
    const items = [
      { cls: 'green', label: 'Smooth (\u22644)' },
      { cls: 'yellow', label: 'Moderate (5\u20138)' },
      { cls: 'orange', label: 'Wide (9\u201312)' },
      { cls: 'red', label: 'Leap (>12)' },
    ];
    for (const item of items) {
      const div = document.createElement('div');
      div.className = 'legend-item';
      const swatch = document.createElement('div');
      swatch.className = `legend-swatch ${item.cls}`;
      const text = document.createElement('span');
      text.textContent = item.label;
      div.appendChild(swatch);
      div.appendChild(text);
      legend.appendChild(div);
    }

    const wrapper = document.getElementById('matrix-wrapper')!;
    wrapper.innerHTML = '';

    const numCols = matrix.columns.length;

    const grid = document.createElement('div');
    grid.className = 'matrix-container';
    this.currentGrid = grid;
    this.currentNumCols = numCols;
    this.updateGridTemplate();

    const cornerLabel = document.createElement('div');
    cornerLabel.className = 'matrix-header-cell';
    cornerLabel.textContent = '';
    grid.appendChild(cornerLabel);

    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-header-cell';
      cell.textContent = matrix.columns[col]!.originalSymbol;
      grid.appendChild(cell);
    }

    const romanLabel = document.createElement('div');
    romanLabel.className = 'matrix-section-label';
    romanLabel.textContent = 'Roman';
    grid.appendChild(romanLabel);

    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-info-cell roman';
      cell.textContent = matrix.columns[col]!.romanAnalysis.figure;
      grid.appendChild(cell);
    }

    const scaleLabel = document.createElement('div');
    scaleLabel.className = 'matrix-section-label';
    scaleLabel.textContent = 'Scale';
    grid.appendChild(scaleLabel);

    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-info-cell scale-name';
      cell.textContent = matrix.columns[col]!.chordScale.scaleName;
      grid.appendChild(cell);
    }

    const dividerLabel = document.createElement('div');
    dividerLabel.className = 'matrix-section-label matrix-divider';
    grid.appendChild(dividerLabel);

    for (let col = 0; col < numCols; col++) {
      const divider = document.createElement('div');
      divider.className = 'matrix-header-cell matrix-divider';
      grid.appendChild(divider);
    }

    for (let pi = 0; pi < paths.length; pi++) {
      const path = paths[pi]!;
      const rowCells: HTMLElement[] = [];
      const isActive = pi === activePathIndex;

      const rowLabel = document.createElement('div');
      rowLabel.className = 'path-row-label';
      if (isActive) rowLabel.classList.add('path-row-active');

      const pathNum = document.createElement('span');
      pathNum.className = 'path-number';
      pathNum.textContent = `Path ${pi + 1}`;
      rowLabel.appendChild(pathNum);

      const pathDist = document.createElement('span');
      pathDist.className = 'path-distance';
      pathDist.textContent = `${path.totalDistance} st`;
      rowLabel.appendChild(pathDist);

      grid.appendChild(rowLabel);

      for (let col = 0; col < numCols; col++) {
        const variantIdx = path.variantIndices[col]!;
        const variant: ChordVariant | undefined =
          matrix.columns[col]!.variants[variantIdx];
        if (!variant) {
          const empty = document.createElement('div');
          empty.className = 'empty-cell';
          grid.appendChild(empty);
          rowCells.push(empty);
          continue;
        }

        const cell = document.createElement('div');
        cell.className = 'matrix-variant-cell';
        cell.dataset['col'] = String(col);
        cell.dataset['variantIndex'] = String(variantIdx);
        cell.dataset['pathIndex'] = String(pi);

        if (isActive) {
          cell.classList.add('selected');

          if (col > 0) {
            const prevVariantIdx = path.variantIndices[col - 1]!;
            const dist = this.lookupPathDistance(
              matrix,
              col,
              prevVariantIdx,
              variantIdx,
            );
            if (dist !== null) {
              const cat = this.getDistanceCategory(dist);
              cell.classList.add(`distance-${cat}`);
            }
          }
        }

        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'cell-symbol';
        symbolSpan.textContent = variant.symbol;
        cell.appendChild(symbolSpan);

        if (variant.category !== 'same-root') {
          cell.classList.add('substitution');
          const badge = document.createElement('div');
          badge.className = `sub-badge ${variant.guideToneMatch}`;
          badge.textContent = BADGE_LABELS[variant.category] ?? variant.category;
          cell.appendChild(badge);
        }

        cell.addEventListener('click', () => {
          this.onCellClick?.(col, variantIdx);
        });

        cell.addEventListener('touchstart', (e: TouchEvent) => {
          this.showTooltipFromTouch(e, matrix.columns[col]!, variant);
        }, { passive: false });

        cell.addEventListener('mouseenter', (e: MouseEvent) => {
          this.showTooltip(e, matrix.columns[col]!, variant);
        });
        cell.addEventListener('mousemove', (e: MouseEvent) => {
          this.moveTooltip(e);
        });
        cell.addEventListener('mouseleave', () => {
          this.hideTooltip();
        });

        const key = `${col}-${variantIdx}-${pi}`;
        this.cells[key] = cell;
        rowCells.push(cell);
        grid.appendChild(cell);
      }

      this.pathRowCells.push(rowCells);
    }

    wrapper.appendChild(grid);

    const optimalBtn = document.getElementById('optimal-btn') as HTMLButtonElement;
    const greedyBtn = document.getElementById('greedy-btn') as HTMLButtonElement;
    const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
    optimalBtn.disabled = false;
    greedyBtn.disabled = false;
    resetBtn.disabled = false;

    this.updatePathPanel(matrix, paths, activePathIndex);
  }

  updatePath(
    matrix: VoiceLeadingMatrix,
    paths: VoiceLeadingPath[],
    activePathIndex: number,
  ): void {
    this.updatePathPanel(matrix, paths, activePathIndex);
  }

  private updatePathPanel(
    matrix: VoiceLeadingMatrix,
    paths: VoiceLeadingPath[],
    activePathIndex: number,
  ): void {
    const pathPanel = document.getElementById('path-panel')!;
    pathPanel.innerHTML = '';

    if (paths.length === 0 || activePathIndex < 0 || activePathIndex >= paths.length) {
      pathPanel.style.display = 'none';
      return;
    }
    pathPanel.style.display = 'flex';

    const activePath = paths[activePathIndex]!;
    const numCols = matrix.columns.length;

    const pathLabel = document.createElement('span');
    pathLabel.className = 'path-label';
    pathLabel.textContent = `Path ${activePathIndex + 1}:`;
    pathPanel.appendChild(pathLabel);

    const chordsDiv = document.createElement('div');
    chordsDiv.className = 'path-chords';

    for (let col = 0; col < numCols; col++) {
      const idx = activePath.variantIndices[col]!;
      const variant = matrix.columns[col]!.variants[idx];
      if (variant) {
        const chordSpan = document.createElement('span');
        chordSpan.textContent = variant.symbol;
        chordsDiv.appendChild(chordSpan);
      } else {
        const placeholder = document.createElement('span');
        placeholder.textContent = '?';
        placeholder.style.color = 'var(--text-muted)';
        chordsDiv.appendChild(placeholder);
      }

      if (col < numCols - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '\u2192';
        chordsDiv.appendChild(arrow);
      }
    }
    pathPanel.appendChild(chordsDiv);

    const distSpan = document.createElement('span');
    distSpan.className = 'path-distance';
    distSpan.textContent = `Total: ${activePath.totalDistance} semitones`;
    pathPanel.appendChild(distSpan);

    const movementsDiv = document.createElement('div');
    movementsDiv.className = 'path-movements';

    for (let col = 1; col < numCols; col++) {
      const prevIdx = activePath.variantIndices[col - 1]!;
      const curIdx = activePath.variantIndices[col]!;
      const dist = this.lookupPathDistance(matrix, col, prevIdx, curIdx);
      if (dist !== null) {
        const span = document.createElement('span');
        span.textContent = `${dist} st`;
        const cat = this.getDistanceCategory(dist);
        span.style.color = `var(--${cat})`;
        movementsDiv.appendChild(span);
      }
    }

    if (movementsDiv.childNodes.length > 0) {
      const movesLabel = document.createElement('span');
      movesLabel.className = 'path-label';
      movesLabel.textContent = 'Steps:';
      pathPanel.appendChild(movesLabel);
      pathPanel.appendChild(movementsDiv);
    }
  }

  clearPath(): void {
    const pathPanel = document.getElementById('path-panel')!;
    pathPanel.style.display = 'none';
    pathPanel.innerHTML = '';

    for (const key of Object.keys(this.cells)) {
      const cell = this.cells[key]!;
      cell.classList.remove(
        'selected',
        'distance-green',
        'distance-yellow',
        'distance-orange',
        'distance-red',
      );
    }
  }

  showError(message: string): void {
    const existing = this.container.querySelector('.error-message');
    if (existing) existing.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.container.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  private lookupPathDistance(
    matrix: VoiceLeadingMatrix,
    col: number,
    prevIdx: number,
    curIdx: number,
  ): number | null {
    if (col <= 0) return null;
    const distMatrix = matrix.distances[col - 1]!;
    const row = distMatrix[prevIdx];
    if (!row) return null;
    const entry = row[curIdx];
    return entry ? entry.totalDistance : null;
  }

  private getDistanceCategory(distance: number): string {
    if (distance <= 4) return 'green';
    if (distance <= 8) return 'yellow';
    if (distance <= 12) return 'orange';
    return 'red';
  }

  private showTooltip(e: MouseEvent, column: MatrixColumn, variant: ChordVariant): void {
    if (!this.tooltip) return;

    this.tooltip.innerHTML = '';

    const symbol = document.createElement('div');
    symbol.className = 'tt-symbol';
    symbol.textContent = variant.symbol;
    this.tooltip.appendChild(symbol);

    const romanLabel = document.createElement('div');
    romanLabel.className = 'tt-label';
    romanLabel.textContent = 'Roman';
    this.tooltip.appendChild(romanLabel);
    const romanVal = document.createElement('div');
    romanVal.className = 'tt-value';
    romanVal.textContent = column.romanAnalysis.figure;
    this.tooltip.appendChild(romanVal);

    const scaleLabelEl = document.createElement('div');
    scaleLabelEl.className = 'tt-label';
    scaleLabelEl.textContent = 'Scale';
    this.tooltip.appendChild(scaleLabelEl);
    const scaleVal = document.createElement('div');
    scaleVal.className = 'tt-value';
    scaleVal.textContent = column.chordScale.scaleName;
    this.tooltip.appendChild(scaleVal);

    if (variant.extensions.length > 0) {
      const extLabel = document.createElement('div');
      extLabel.className = 'tt-label';
      extLabel.textContent = 'Extensions';
      this.tooltip.appendChild(extLabel);
      const extVal = document.createElement('div');
      extVal.className = 'tt-value';
      extVal.textContent = variant.extensions.join(', ');
      this.tooltip.appendChild(extVal);
    }

    const gtLabel = document.createElement('div');
    gtLabel.className = 'tt-label';
    gtLabel.textContent = 'Guide Tones';
    this.tooltip.appendChild(gtLabel);
    const gtVal = document.createElement('div');
    gtVal.className = 'tt-value';
    const gt0 = PITCH_CLASS_SHARPS[variant.guideTones[0]];
    const gt1 = PITCH_CLASS_SHARPS[variant.guideTones[1]];
    gtVal.textContent = `${gt0}, ${gt1}`;
    this.tooltip.appendChild(gtVal);

    const tensionLabel = document.createElement('div');
    tensionLabel.className = 'tt-label';
    tensionLabel.textContent = 'Available Tensions';
    this.tooltip.appendChild(tensionLabel);
    const tensionVal = document.createElement('div');
    tensionVal.className = 'tt-value';
    tensionVal.textContent =
      column.chordScale.availableTensions.length > 0
        ? column.chordScale.availableTensions.join(', ')
        : 'None';
    this.tooltip.appendChild(tensionVal);

    if (variant.category !== 'same-root') {
      const subLabel = document.createElement('div');
      subLabel.className = 'tt-label';
      subLabel.textContent = 'Substitution';
      this.tooltip.appendChild(subLabel);
      const subVal = document.createElement('div');
      subVal.className = 'tt-value';
      const CATEGORY_DESCRIPTIONS: Record<string, string> = {
        'tritone-substitute': 'Tritone substitute',
        'dim7-equivalent': 'Diminished equivalent',
        'm6-on-fifth': 'm6 on 5th (= V9)',
        'm6-enharmonic': 'm6 enharmonic',
        'm7-sus-substitute': 'm7 sus substitute',
        'augmented-dominant': 'Augmented dominant',
        'relative-major6': 'Relative M6 (same notes)',
        'relative-major7': 'Relative maj7 (rootless m9)',
        'relative-minor6': 'Relative m6',
        'iii-for-I': 'iii-for-I (rootless Imaj9)',
        'vi9-for-I': 'vi9-for-I',
        'm6-on-third': 'm6 on 3rd (Lydian)',
        'halfdim-to-m6': 'm6 on min3rd (same notes)',
        'halfdim-to-m7': 'm7 on min3rd (rootless m9b5)',
      };
      subVal.textContent = CATEGORY_DESCRIPTIONS[variant.category] ?? variant.category;
      this.tooltip.appendChild(subVal);

      const matchLabel = document.createElement('div');
      matchLabel.className = 'tt-label';
      matchLabel.textContent = 'Guide Tone Match';
      this.tooltip.appendChild(matchLabel);
      const matchVal = document.createElement('div');
      matchVal.className = 'tt-value';
      matchVal.textContent = variant.guideToneMatch === 'exact' ? 'Exact' : 'Near-miss (\u00B11 semitone)';
      this.tooltip.appendChild(matchVal);
    }

    this.tooltip.style.display = 'block';
    this.moveTooltip(e);
  }

  private moveTooltip(e: MouseEvent): void {
    if (!this.tooltip) return;

    const pad = 12;
    let x = e.clientX + pad;
    let y = e.clientY + pad;

    const rect = this.tooltip.getBoundingClientRect();
    if (x + rect.width > window.innerWidth - pad) {
      x = e.clientX - rect.width - pad;
    }
    if (y + rect.height > window.innerHeight - pad) {
      y = e.clientY - rect.height - pad;
    }

    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }

  private updateGridTemplate(): void {
    if (!this.currentGrid || !this.currentNumCols) return;
    const w = window.innerWidth;
    if (w < 480) {
      this.currentGrid.style.gridTemplateColumns = `48px repeat(${this.currentNumCols}, 58px)`;
    } else if (w < 768) {
      this.currentGrid.style.gridTemplateColumns = `72px repeat(${this.currentNumCols}, 72px)`;
    } else {
      this.currentGrid.style.gridTemplateColumns = `120px repeat(${this.currentNumCols}, 1fr)`;
    }
  }

  private showTooltipFromTouch(
    e: TouchEvent,
    column: MatrixColumn,
    variant: ChordVariant,
  ): void {
    e.preventDefault();
    const touch = e.touches[0]!;
    this.showTooltip(
      { clientX: touch.clientX, clientY: touch.clientY } as MouseEvent,
      column,
      variant,
    );
  }
}
