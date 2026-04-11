export function encodeHash(chords: string, key: string, mode: string): string {
    const chordList = chords.trim().split(/[\s,|]+/).filter(s => s.length > 0);
    const encodedChords = chordList.map(c => encodeURIComponent(c)).join('-');

    if (key === 'C' && mode === 'major') {
        return encodedChords;
    }

    const encodedKey = encodeURIComponent(key);
    const modeSuffix = mode === 'minor' ? '.m' : '';
    return `${encodedKey}${modeSuffix}:${encodedChords}`;
}

export function decodeHash(hash: string): { chords: string; key: string; mode: string } | null {
    const stripped = hash.replace(/^#/, '');
    if (!stripped) return null;

    let keyStr: string | null = null;
    let chordsStr: string;

    const colonIdx = stripped.indexOf(':');
    if (colonIdx !== -1) {
        try {
            keyStr = decodeURIComponent(stripped.substring(0, colonIdx));
        } catch {
            keyStr = stripped.substring(0, colonIdx);
        }
        chordsStr = stripped.substring(colonIdx + 1);
    } else {
        chordsStr = stripped;
    }

    const chordList = chordsStr
        .split('-')
        .map(c => {
            try {
                return decodeURIComponent(c);
            } catch {
                return c;
            }
        })
        .filter(s => s.length > 0);

    if (chordList.length === 0) return null;

    let key = 'C';
    let mode = 'major';

    if (keyStr !== null) {
        if (keyStr.endsWith('.m')) {
            key = keyStr.slice(0, -2);
            mode = 'minor';
        } else {
            key = keyStr;
            mode = 'major';
        }
    }

    return { chords: chordList.join(' '), key, mode };
}
