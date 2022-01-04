import { type State } from './reducer'
import { Player, Round, Turn, Color } from './types'

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

export function getHasPlayerPassed(state: State, color: Color): boolean {
  return state.turns.some(
    turn =>
      turn.playerColor === color &&
      turn.roundIndex === state.activeRoundIndex &&
      turn.type === 'pass',
  )
}

export function getHasActivePlayerPassed(state: State): boolean {
  const activePlayer = getActivePlayer(state)

  return getHasPlayerPassed(state, activePlayer.color)
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

export function getPlayerTurns(state: State, color: Color) {
  const player = state.players.find(player => player.color === color)

  return state.turns.filter(turn => turn.playerColor === player.color)
}

export function getTotalPlayerTime(state: State, color: Color): number {
  const playerTurns = getPlayerTurns(state, color)

  return playerTurns.map(turn => turn.endTime - turn.startTime).reduce((a, b) => a + b)
}
