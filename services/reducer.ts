import {
  getActivePlayer,
  getActiveRound,
  getActiveTurn,
  getHasActivePlayerPassed,
  getNextPlayer,
  getNextPlayerIndex,
  getNextRound,
  getNextRoundIndex,
} from './selectors'
import { Player, Round, Turn, Actions } from './types'

import { v4 } from 'uuid'

export type State = {
  turns: Turn[]
  rounds: Round[]
  players: Player[]
  activeRoundIndex: number | null
  activePlayerIndex: number
}

export function reducer<S extends State, A extends Actions>(state: S, action: A): State {
  switch (action.type) {
    case 'START_ROUND': {
      const nextRound = getNextRound(state)
      const nextRoundIndex = getNextRoundIndex(state)

      return {
        ...state,
        rounds: [
          ...state.rounds.slice(0, -1),
          { ...nextRound, startTime: Date.now() },
          {
            startTime: null,
            playerOrder: [],
          },
        ],
        turns: [
          ...state.turns,
          {
            startTime: Date.now(),
            roundIndex: nextRoundIndex,
            playerId: nextRound.playerOrder[0],
          },
        ],
        activeRoundIndex: nextRoundIndex,
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

      if (!activePlayer || !nextPlayer) return state

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
        activePlayerIndex: isLastPassForRound ? 0 : nextPlayerIndex,
      }
    }

    case 'ADD_PLAYER': {
      const currentRound = getActiveRound(state)
      const player = { id: v4(), ...action.data }

      return {
        ...state,
        players: [...state.players, player],
        rounds: [{ ...currentRound, playerOrder: [player.id, ...currentRound.playerOrder] }],
      }
    }
  }

  return state
}

export const defaultState: State = {
  turns: [],
  rounds: [{ startTime: null, playerOrder: [] }],
  players: [],
  activeRoundIndex: null,
  activePlayerIndex: 0,
}
