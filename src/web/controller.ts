import {
  generateMatrix,
  type VoiceLeadingMatrix,
  type VoiceLeadingPath,
  type GenerateMatrixOptions,
} from '../lib/index.js';

export class Controller {
  private matrix: VoiceLeadingMatrix | null = null;
  private paths: VoiceLeadingPath[] = [];
  private activePathIndex: number = 0;
  private onPathsUpdate:
    | ((matrix: VoiceLeadingMatrix, paths: VoiceLeadingPath[], activePathIndex: number) => void)
    | null = null;
  private onError: ((message: string) => void) | null = null;

  setOnPathsUpdate(
    handler: (matrix: VoiceLeadingMatrix, paths: VoiceLeadingPath[], activePathIndex: number) => void,
  ): void {
    this.onPathsUpdate = handler;
  }

  setOnError(handler: (message: string) => void): void {
    this.onError = handler;
  }

  handleGenerate(chordInput: string, tonic: string, mode: string): void {
    try {
      const chords = chordInput
        .trim()
        .split(/[\s,|]+/)
        .filter((s) => s.length > 0);

      if (chords.length === 0) {
        this.onError?.('Please enter at least one chord symbol.');
        return;
      }

    const matrixOptions: GenerateMatrixOptions = {
        includeRootLeading: true,
      };
      this.matrix = generateMatrix(chords, tonic, mode as 'major' | 'minor', matrixOptions);
      this.paths = this.matrix.paths;
      this.activePathIndex = 0;
      this.onPathsUpdate?.(this.matrix, this.paths, this.activePathIndex);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : 'An unexpected error occurred.';
      this.onError?.(msg);
    }
  }

  handleCellClick(col: number, variantIndex: number): void {
    if (!this.matrix) return;

    const colData = this.matrix.columns[col];
    if (!colData || variantIndex >= colData.variants.length) return;

    this.paths = this.matrix.reanchorFrom(col, variantIndex, 8);
    this.activePathIndex = 0;
    this.onPathsUpdate?.(this.matrix, this.paths, this.activePathIndex);
  }

  handleShowOptimalPath(): void {
    if (!this.matrix) return;

    const optimal = this.matrix.findOptimalPath();
    this.paths = [optimal];
    this.activePathIndex = 0;
    this.onPathsUpdate?.(this.matrix, this.paths, this.activePathIndex);
  }

  handleShowGreedyPath(): void {
    if (!this.matrix) return;

    const greedy = this.matrix.findGreedyPath();
    this.paths = [greedy];
    this.activePathIndex = 0;
    this.onPathsUpdate?.(this.matrix, this.paths, this.activePathIndex);
  }

  handleReset(): void {
    if (!this.matrix) return;

    this.paths = this.matrix.paths;
    this.activePathIndex = 0;
    this.onPathsUpdate?.(this.matrix, this.paths, this.activePathIndex);
  }

  getMatrix(): VoiceLeadingMatrix | null {
    return this.matrix;
  }

  getPaths(): VoiceLeadingPath[] {
    return this.paths;
  }

  getActivePathIndex(): number {
    return this.activePathIndex;
  }
}
