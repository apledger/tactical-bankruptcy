/* eslint-disable react/no-unescaped-entities */

import { useEffect, useReducer } from 'react'
import cn from 'classnames'
import { faUndo, faRedo, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '../components/Button'
import { Timer } from '../components/Timer'
import { TurnMarker } from '../components/TurnMarker'
import { defaultState, reducer } from '../services/reducer'
import {
  getActivePlayer,
  getActiveRound,
  getNextRound,
  getActiveTurn,
  getHasActivePlayerPassed,
  getHasPlayerPassed,
  getTotalPlayerTime,
  getPlayer,
} from '../services/selectors'
import { useHistoryReducer } from '../services/useHistoryReducer'
import { useHotkeys } from 'react-hotkeys-hook'
import { PlayerMarker } from '../components/PlayerMarker'
import { FactionBadge } from '../components/FactionBadge'
import { useGameContext } from '../services/useGameContext'
import { useRouter } from 'next/router'

function msToHMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`
}

export default function Home() {
  const router = useRouter()
  const { state, dispatch } = useGameContext()
  const { players } = state
  const activeTurn = getActiveTurn(state)
  const hasActivePlayerPassed = getHasActivePlayerPassed(state)

  console.log({ players: state.players })

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
  }, [state, router])

  useHotkeys('cmd+z, ctrl+z', () => dispatch({ type: 'UNDO' }), [dispatch])
  useHotkeys('cmd+shift+z, ctrl+shift+z, cmd+y, ctrl+y', () => dispatch({ type: 'REDO' }), [
    dispatch,
  ])
  useHotkeys(
    'space',
    () => {
      if (activeTurn) {
        dispatch({
          type: 'END_PLAYER_TURN',
          data: { type: hasActivePlayerPassed ? 'reaction' : 'action' },
        })
      } else {
        dispatch({ type: 'START_ROUND' })
      }
    },
    [dispatch, hasActivePlayerPassed, activeTurn],
  )
  useHotkeys(
    'enter, esc',
    () => {
      if (activeTurn) {
        dispatch({
          type: 'END_PLAYER_TURN',
          data: { type: 'pass' },
        })
      }
    },
    [dispatch, hasActivePlayerPassed, activeTurn],
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="h-24 bg-black flex flex-col items-center justify-center">
        <div className="text-md font-display text-white uppercase">Game Over</div>
      </div>
      <div className="grid p-5 max-w-lg mx-auto w-full">
        {players.map(player => (
          <div
            key={player.id}
            className="flex justify-between items-center p-4 border-b border-black/25"
          >
            <div className="flex gap-3 items-center">
              <FactionBadge factionId={player.factionId} size="small" />
              <div className="text-lg uppercase">{player.name}</div>
            </div>
            <div className="text-lg">{msToHMS(getTotalPlayerTime(state, player.id))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
