export type HobbyTone = 'sky' | 'violet' | 'green' | 'amber' | 'rose' | 'indigo' | 'teal' | 'slate'

const HOBBY_TONES: Record<string, HobbyTone> = {
  Travel: 'sky',
  Photography: 'violet',
  Hiking: 'green',
  Reading: 'amber',
  Cooking: 'rose',
  Music: 'indigo',
  Cycling: 'teal',
  Gardening: 'green',
  Fishing: 'sky',
  Gaming: 'slate',
}

export function getHobbyTone(hobby: string): HobbyTone {
  return HOBBY_TONES[hobby] ?? 'slate'
}
