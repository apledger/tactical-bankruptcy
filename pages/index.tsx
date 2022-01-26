/* eslint-disable react/no-unescaped-entities */

import { useEffect, useReducer } from 'react'
import cn from 'classnames'
import router, { useRouter } from 'next/router'
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

function msToHMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`
}

export default function Home() {
  const { state, dispatch } = useGameContext()

  useEffect(() => {
    console.log(state.players.length)
    if (state.players.length === 0) router.push('/setup')
    else {
      console.log('here')
      router.push('/play')
    }
  }, [state])

  return <div>Home!</div>
}
