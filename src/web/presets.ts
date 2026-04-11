export interface Preset {
    name: string;
    chords: string;
    key: string;
    mode: string;
}

export const PRESETS: Preset[] = [
    { name: 'ii-V-I (Major)', chords: 'Dm7 G7 Cmaj7', key: 'C', mode: 'major' },
    { name: 'ii-V-I (Minor)', chords: 'Dm7b5 G7 Cm7', key: 'C', mode: 'minor' },
    { name: 'Rhythm Changes (A)', chords: 'Cmaj7 Am7 Dm7 G7 Cmaj7 Am7 Dm7 G7', key: 'C', mode: 'major' },
    { name: 'Autumn Leaves', chords: 'Am7b5 D7 Gm7 Cm7 F7 Bbmaj7 Ebmaj7', key: 'G', mode: 'minor' },
    { name: 'Take the "A" Train', chords: 'Cmaj7 D7 Dm7 G7 Cmaj7', key: 'C', mode: 'major' },
    { name: 'E7 A7 D7 Dm7', chords: 'E7 A7 D7 Dm7', key: 'C', mode: 'major' },
];
