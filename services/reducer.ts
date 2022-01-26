import {
  getActivePlayer,
  getActiveRound,
  getActiveTurn,
  getHasActivePlayerPassed,
  getNextPlayer,
  getNextPlayerIndex,
  getNextRound,
} from './selectors'
import { Player, Round, Turn, Actions } from './types'

import { players } from './players'

export type State = {
  turns: Turn[]
  rounds: Round[]
  players: Player[]
  activeRoundIndex: number
  activePlayerIndex: number
}

export function reducer<S extends State, A extends Actions>(state: S, action: A): State {
  switch (action.type) {
    case 'START_ROUND': {
      const activeRound = getActiveRound(state)

      return {
        ...state,
        rounds: [
          ...state.rounds.slice(0, -1),
          { ...activeRound, startTime: Date.now() },
          {
            startTime: null,
            playerOrder: [],
          },
        ],
        turns: [
          ...state.turns,
          {
            startTime: Date.now(),
            roundIndex: state.activeRoundIndex,
            playerId: activeRound.playerOrder[0],
          },
        ],
      }
    }

    case 'END_PLAYER_TURN': {
      const activeTurn = getActiveTurn(state)
      const activePlayer = getActivePlayer(state)
      const hasActivePlayerPassed = getHasActivePlayerPassed(state)
      const nextRound = getNextRound(state)
      const nextPlayerIndex = getNextPlayerIndex(state)
      const nextPlayer = getNextPlayer(state)
      const isFirstTimePassing = !hasActivePlayerPassed && action.data.type === 'pass'
      const isLastPassForRound =
        isFirstTimePassing && nextRound.playerOrder.length === state.players.length - 1

      return {
        ...state,
        turns: [
          ...state.turns.slice(0, -1),
          { ...activeTurn, endTime: Date.now(), type: action.data.type },
          ...(isLastPassForRound
            ? []
            : [
                {
                  startTime: Date.now(),
                  roundIndex: state.activeRoundIndex,
                  playerId: nextPlayer.id,
                },
              ]),
        ],
        rounds: isFirstTimePassing
          ? [
              ...state.rounds.slice(0, -1),
              { ...nextRound, playerOrder: [...nextRound.playerOrder, activePlayer.id] },
            ]
          : state.rounds,
        activeRoundIndex: isLastPassForRound ? state.activeRoundIndex + 1 : state.activeRoundIndex,
        activePlayerIndex: isLastPassForRound ? 0 : nextPlayerIndex,
      }
    }
  }

  return state
}

export const defaultState: State = {
  turns: [],
  rounds: [{ startTime: null, playerOrder: players.map(player => player.id) }],
  players: [],
  activeRoundIndex: 0,
  activePlayerIndex: 0,
}
