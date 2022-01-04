import { type State } from './reducer'
import { Player, Round, Turn } from './types'

export function getActivePlayer(state: State): Player {
  return state.players[state.activePlayerIndex]
}

export function getActiveRound(state: State): Round {
  return state.rounds[state.activeRoundIndex]
}

export function getActiveTurn(state: State): Turn {
  return state.turns.at(-1)
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
