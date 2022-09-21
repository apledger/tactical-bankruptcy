export type Color = 'lightGray' | 'red' | 'blue' | 'darkGray' | 'yellow' | 'green'

export type Turn = {
  roundIndex: number
  playerId: Color
  startTime: number
  endTime?: number
  type?: 'action' | 'reaction' | 'pass'
}

export type Round = {
  startTime: number | null
  endTime?: number
  playerOrder: string[]
}

export type Score = {
  reputation?: number
  ambassador?: number
  sectors?: number
  monoliths?: number
  discoveries?: number
  traitor?: number
  tech?: number
  bonus?: number
}

export type Player = {
  id: string
  factionId: string
  name: string
  score?: Score
}

export type Actions =
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'START_ROUND'; data: { time: number } }
  | { type: 'END_PLAYER_TURN'; data: { type: Turn['type']; time: number } }
  | { type: 'ADD_PLAYER'; data: { factionId: string; name: string } }
  | { type: 'UPDATE_PLAYER_SCORE'; data: { playerId: string; value: number; key: string } }
  | { type: 'FOCUS_PLAYER'; data: { playerId: string } }
  | { type: 'BLUR_PLAYER' }

export type Faction = {
  id: string
  name: string
  color: string
  icon: string
}
