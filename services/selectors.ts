import { type State } from './reducer'
import { Player, Round, Turn } from './types'

export function getPlayer(state: State, id: string): Player {
  const player = state.players.find(player => player.id === id)

  if (!player) throw new Error(`Player: ${id} could not be found`)

  return player
}

export function getActivePlayer(state: State): Player | null {
  const activeRound = getActiveRound(state)
  const activePlayerId = activeRound.playerOrder[state.activePlayerIndex]

  if (!activePlayerId) return null

  return getPlayer(state, activePlayerId)
}

export function getActiveRound(state: State): Round {
  return state.rounds[state.activeRoundIndex ?? 0]
}

export function getActiveTurn(state: State): Turn | null {
  return (
    state.turns
      .filter(turn => turn.roundIndex === state.activeRoundIndex)
      .slice()
      .reverse()
      .find(turn => turn.endTime == null) ?? null
  )
}

export function getNextRoundIndex(state: State): number {
  return state.activeRoundIndex == null ? 0 : state.activeRoundIndex + 1
}

export function getNextRound(state: State): Round {
  return state.rounds[getNextRoundIndex(state)]
}

export function getHasPlayerPassed(state: State, id: string): boolean {
  return state.turns.some(
    turn =>
      turn.playerId === id && turn.roundIndex === state.activeRoundIndex && turn.type === 'pass',
  )
}

export function getIsActiveRoundDone(state: State): boolean {
  return state.players.every(player => getHasPlayerPassed(state, player.id))
}

export function getHasActivePlayerPassed(state: State): boolean {
  const activePlayer = getActivePlayer(state)

  if (!activePlayer) return false

  return getHasPlayerPassed(state, activePlayer.id)
}

export function getNextPlayerIndex(state: State): number {
  return (state.activePlayerIndex + 1) % state.players.length
}

export function getNextPlayer(state: State): Player | null {
  const activeRound = getActiveRound(state)
  const nextPlayerIndex = getNextPlayerIndex(state)

  const activePlayerId = activeRound.playerOrder[nextPlayerIndex]

  if (!activePlayerId) return null

  return getPlayer(state, activePlayerId)
}

export function getPlayerTurns(state: State, id: string) {
  const player = getPlayer(state, id)

  return state.turns.filter(turn => turn.playerId === player.id)
}

export function getTotalPlayerTime(state: State, id: string): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns
    .map(turn => (turn.endTime ?? Date.now()) - turn.startTime)
    .reduce((a, b) => a + b, 0)
}

export function getOrderedPlayers(state: State, roundIndex?: number): Player[] {
  const round = roundIndex != null ? state.rounds[roundIndex] : getActiveRound(state)

  return round?.playerOrder.map(playerId => getPlayer(state, playerId)) ?? []
}
