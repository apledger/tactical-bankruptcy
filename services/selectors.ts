import { type State } from './reducer'
import { Player, Round, Turn } from './types'

export function getActivePlayer(state: State): Player {
  const activeRound = getActiveRound(state)
  const activeColor = activeRound.playerOrder[state.activePlayerIndex]

  return state.players.find(player => player.color === activeColor)
}

export function getActiveRound(state: State): Round {
  return state.rounds[state.activeRoundIndex]
}

export function getActiveTurn(state: State): Turn {
  return state.turns.filter(turn => turn.roundIndex === state.activeRoundIndex).at(-1)
}

export function getNextRound(state: State): Round {
  return state.rounds[state.activeRoundIndex + 1]
}

export function getHasActivePlayerPassed(state: State): boolean {
  const activePlayer = getActivePlayer(state)

  return state.turns.some(
    turn =>
      turn.playerColor === activePlayer.color &&
      turn.roundIndex === state.activeRoundIndex &&
      turn.type === 'pass',
  )
}

export function getNextPlayerIndex(state: State): number {
  return (state.activePlayerIndex + 1) % state.players.length
}

export function getNextPlayer(state: State): Player {
  const nextPlayerIndex = getNextPlayerIndex(state)
  const activeRound = getActiveRound(state)
  const activeColor = activeRound.playerOrder[nextPlayerIndex]

  return state.players.find(player => player.color === activeColor)
}

export function getActivePlayerTurns(state: State, roundIndex?: number) {
  const activePlayer = getActivePlayer(state)

  return state.turns.filter(
    turn =>
      turn.roundIndex === (roundIndex ?? state.activeRoundIndex) &&
      turn.playerColor === activePlayer.color,
  )
}
