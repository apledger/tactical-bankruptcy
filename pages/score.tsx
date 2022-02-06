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
  getTotalGameTime,
  getTotalPlayerActions,
  getTotalPlayerReactions,
  getTotalPlayerPasses,
} from '../services/selectors'
import { useHistoryReducer } from '../services/useHistoryReducer'
import { useHotkeys } from 'react-hotkeys-hook'
import { PlayerMarker } from '../components/PlayerMarker'
import { FactionBadge } from '../components/FactionBadge'
import { useGameContext } from '../services/useGameContext'
import { factions } from '../services/factions'
import { useRouter } from 'next/router'
import { StatBadge } from '../components/StatBadge'

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

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
  }, [state, router])

  useHotkeys(
    'cmd+z, ctrl+z',
    () => {
      router.push('play')
    },
    [router],
  )

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="h-20 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <StatBadge label="Game Over" />
          <StatBadge label="Turns" value={Math.ceil(state.turns.length / players.length)} />
          <StatBadge label="Time" value={msToHMS(getTotalGameTime(state))} />
        </div>
      </div>

      <div className="w-full flex-grow flex justify-center pt-20">
        <div className="max-w-5xl w-9/12">
          <table className="min-w-full divide-y divide-slate-200 border border-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Actions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Reactions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Passes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 uppercase">
              {players.map(player => {
                const faction = factions.find(f => f.id === player.factionId)

                return (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <FactionBadge factionId={player.factionId} size="small" />
                        </div>
                        <div className="ml-4">
                          <div className="text-xl font-medium text-slate-900 leading-none">
                            {player.name}
                          </div>
                          <div className="text-xs text-slate-500">{faction?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl text-slate-900">
                        {getTotalPlayerActions(state, player.id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl text-slate-900">
                        {getTotalPlayerReactions(state, player.id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl text-slate-900">
                        {getTotalPlayerPasses(state, player.id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl text-slate-900">
                        {msToHMS(getTotalPlayerTime(state, player.id))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
