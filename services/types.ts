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
  playerOrder: string[]
}

export type Player = {
  id: string
  factionId: string
  name: string
}

export type Actions =
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'START_ROUND' }
  | { type: 'END_PLAYER_TURN'; data: { type: Turn['type'] } }
  | { type: 'BACK' }

export type Faction = {
  id: string
  name: string
  color: string
  icon: string
}
