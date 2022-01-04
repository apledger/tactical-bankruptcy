import { Player, Round, Turn } from './types'

export type State = {
  turns: Turn[]
  rounds: Round[]
  players: Player[]
  activeRoundIndex: number
  activePlayerIndex: number
}

export type Actions =
  | { type: 'START_ROUND' }
  | { type: 'START_PLAYER_TURN' }
  | { type: 'END_PLAYER_TURN'; data: { type: Turn['type'] } }

export const reducer = (state: State, action: Actions): State => {
  const currentPlayer = state.players[state.activePlayerIndex]
  const currentRound = state.rounds[state.activeRoundIndex]
  const currentTurn = state.turns.at(-1)

  switch (action.type) {
    case 'START_ROUND':
      return {
        ...state,
        rounds: [
          ...state.rounds.slice(0, -1),
          { ...currentRound, startTime: Date.now() },
          {
            startTime: Date.now(),
            playerOrder: [],
          },
        ],
        turns: [
          {
            startTime: Date.now(),
            roundIndex: state.activeRoundIndex,
            playerColor: currentRound.playerOrder[0],
          },
        ],
      }
    case 'END_PLAYER_TURN':
      const currentRoundPlayerTurns = state.turns.filter(
        turn =>
          turn.roundIndex === state.activeRoundIndex && turn.playerColor === currentPlayer.color,
      )
      const nextPlayerIndex = (state.activePlayerIndex + 1) % state.players.length

      return {
        ...state,
        activePlayerIndex: nextPlayerIndex,
        turns: [
          ...state.turns.slice(0, -1),
          { ...currentTurn, endTime: Date.now(), type: action.data.type },
          {
            playerColor: state.players[nextPlayerIndex].color,
            startTime: Date.now(),
            roundIndex: state.activeRoundIndex,
          },
        ],
      }
  }

  return state
}

export const defaultState: State = {
  turns: [],
  rounds: [{ startTime: null, playerOrder: [] }],
  players: [
    {
      name: 'Sean',
      color: 'gray',
      isAlien: false,
    },
    {
      name: 'Ryan',
      color: 'red',
      isAlien: false,
    },
    {
      name: 'Alan',
      color: 'blue',
      isAlien: false,
    },
  ],
  activeRoundIndex: 0,
  activePlayerIndex: 0,
}
