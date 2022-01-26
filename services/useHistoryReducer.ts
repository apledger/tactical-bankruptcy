import { useReducer, Reducer, Dispatch } from 'react'
import { Actions } from './types'

type State<S> = {
  past: S[]
  present: S
  future: S[]
}

export function useHistoryReducer<S, A extends Actions>(
  reducer: Reducer<S, A>,
  initialState: S,
): [State<S>, Dispatch<A>] {
  const undoState: State<S> = {
    past: [],
    present: initialState,
    future: [],
  }

  const undoReducer = (state: State<S>, action: A) => {
    const newPresent = reducer(state.present, action)

    if (action.type === 'UNDO') {
      if (state.past.length === 0) return state

      const [newPresent, ...past] = state.past

      return {
        past,
        present: newPresent,
        future: [state.present, ...state.future],
      }
    }
    if (action.type === 'REDO') {
      if (state.future.length === 0) return state

      const [newPresent, ...future] = state.future

      return {
        past: [state.present, ...state.past],
        present: newPresent,
        future,
      }
    }
    return {
      past: [state.present, ...state.past],
      present: newPresent,
      future: [],
    }
  }

  return useReducer(undoReducer, undoState)
}
