export type Color = 'gray' | 'red' | 'blue' | 'black' | 'yellow' | 'green'

export type Turn = {
  roundIndex: number
  playerColor: Color
  startTime: number
  endTime?: number
  type?: 'action' | 'reaction' | 'pass'
}

export type Round = {
  startTime: number | null
  playerOrder: Color[]
}

export type Player = {
  name: string
  color: Color
  isAlien: boolean
}
