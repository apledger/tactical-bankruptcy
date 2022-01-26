import { useHotkeys } from 'react-hotkeys-hook'
import { useGameContext } from '../services/useGameContext'

export default function Setup() {
  const { state, dispatch } = useGameContext()

  useHotkeys('cmd+z, ctrl+z', () => dispatch({ type: 'UNDO' }), [dispatch])
  useHotkeys('cmd+shift+z, ctrl+shift+z, cmd+y, ctrl+y', () => dispatch({ type: 'REDO' }), [
    dispatch,
  ])

  return <div>Setup!</div>
}
