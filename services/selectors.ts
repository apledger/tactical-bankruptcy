import { type State } from './reducer'
import { Player, Round, Turn } from './types'

const LAST_ROUND_INDEX = 7

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
    .map(turn => (turn.endTime != null ? turn.endTime - turn.startTime : 0))
    .reduce((a, b) => a + b, 0)
}

export function getTotalPlayerActions(state: State, id: string): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.filter(turn => turn.type === 'action').length
}

export function getTotalPlayerReactions(state: State, id: string): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.filter(turn => turn.type === 'reaction').length
}

export function getRoundPlayerTime(state: State, id: string, roundIndex?: number): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns
    .filter(turn => turn.roundIndex === (roundIndex ?? state.activeRoundIndex))
    .map(turn => (turn.endTime != null ? turn.endTime - turn.startTime : 0))
    .reduce((a, b) => a + b, 0)
}

export function getRoundPlayerActions(state: State, id: string, roundIndex?: number): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.filter(
    turn => turn.roundIndex === (roundIndex ?? state.activeRoundIndex) && turn.type === 'action',
  ).length
}

export function getRoundPlayerReactions(state: State, id: string, roundIndex?: number): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.filter(
    turn => turn.roundIndex === (roundIndex ?? state.activeRoundIndex) && turn.type === 'reaction',
  ).length
}

export function getTotalPlayerPasses(state: State, id: string): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.filter(turn => turn.type === 'pass').length
}

export function getOrderedPlayers(state: State, roundIndex?: number): Player[] {
  const round = roundIndex != null ? state.rounds[roundIndex] : getActiveRound(state)

  return round?.playerOrder.map(playerId => getPlayer(state, playerId)) ?? []
}

export function getActiveRoundTurns(state: State): Turn[] {
  const activeRoundIndex = state.activeRoundIndex ?? 0

  return state.turns.filter(turn => turn.roundIndex === activeRoundIndex)
}

export function getIsLastRound(state: State): boolean {
  return state.activeRoundIndex === 7
}

export function getTotalGameTime(state: State): number {
  const firstRound = state.rounds[0]
  const lastRound = state.rounds[LAST_ROUND_INDEX]

  if (lastRound?.endTime != null && firstRound.startTime != null) {
    return lastRound.endTime - firstRound.startTime
  }

  return 0
}

export function getFocusedPlayer(state: State): Player | null {
  if (state.focusedPlayerId == null) return null

  return getPlayer(state, state.focusedPlayerId)
}

export function getPlayerLongestTurn(state: State, playerId: string): number {
  const turns = getPlayerTurns(state, playerId)

  return Math.max(
    ...turns.map(({ startTime, endTime }) =>
      startTime != null && endTime != null ? endTime - startTime : 0,
    ),
  )
}
