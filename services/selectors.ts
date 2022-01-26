import { type State } from './reducer'
import { Player, Round, Turn, Color } from './types'

export function getPlayer(state: State, id: string): Player {
  console.log({ state, id })
  return state.players.find(player => player.id === id)
}

export function getActivePlayer(state: State): Player | null {
  const activeRound = getActiveRound(state)
  const activePlayerId = activeRound.playerOrder[state.activePlayerIndex]

  return state.players.find(player => player.id === activePlayerId) ?? null
}

export function getActiveRound(state: State): Round {
  return state.rounds[state.activeRoundIndex]
}

export function getActiveTurn(state: State): Turn {
  return state.turns.filter(turn => turn.roundIndex === state.activeRoundIndex).slice(-1)[0]
}

export function getNextRound(state: State): Round {
  return state.rounds[state.activeRoundIndex + 1]
}

export function getHasPlayerPassed(state: State, id: string): boolean {
  return state.turns.some(
    turn =>
      turn.playerId === id && turn.roundIndex === state.activeRoundIndex && turn.type === 'pass',
  )
}

export function getHasActivePlayerPassed(state: State): boolean {
  const activePlayer = getActivePlayer(state)

  return getHasPlayerPassed(state, activePlayer?.id)
}

export function getNextPlayerIndex(state: State): number {
  return (state.activePlayerIndex + 1) % state.players.length
}

export function getNextPlayer(state: State): Player {
  const nextPlayerIndex = getNextPlayerIndex(state)
  const activeRound = getActiveRound(state)
  const activePlayerId = activeRound.playerOrder[nextPlayerIndex]

  return state.players.find(player => player.id === activePlayerId)
}

export function getPlayerTurns(state: State, id: string) {
  const player = state.players.find(player => player.id === id)

  return state.turns.filter(turn => turn.playerId === player.id)
}

export function getTotalPlayerTime(state: State, id: string): number {
  const playerTurns = getPlayerTurns(state, id)

  return playerTurns.map(turn => turn.endTime - turn.startTime).reduce((a, b) => a + b)
}
