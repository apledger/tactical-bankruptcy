import { useContext, createContext, Dispatch, ReactNode } from 'react'
import { defaultState, reducer, State } from './reducer'
import { Actions } from './types'
import { useHistoryReducer } from './useHistoryReducer'

type Context = {
  state: State
  dispatch: Dispatch<Actions>
  canUndo: boolean
  canRedo: boolean
}

export const GameContext = createContext<Context>({
  state: defaultState,
  dispatch: () => {},
  canUndo: false,
  canRedo: false,
})

type Props = {
  children: ReactNode
}

export function GameContextProvider({ children }: Props) {
  const [{ present: state, past, future }, dispatch] = useHistoryReducer(reducer, defaultState)

  return (
    <GameContext.Provider
      value={{ state, dispatch, canUndo: past.length > 0, canRedo: future.length > 0 }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  return useContext(GameContext)
}
