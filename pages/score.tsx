/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'

import {
  getTotalPlayerTime,
  getTotalGameTime,
  getTotalPlayerActions,
  getTotalPlayerReactions,
  getTotalPlayerPasses,
  getFocusedPlayer,
} from '../services/selectors'
import { FactionBadge } from '../components/FactionBadge'
import { FactionName } from '../components/FactionName'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Checkbox } from '../components/Checkbox'
import { StatBadge } from '../components/StatBadge'
import { useGameContext } from '../services/useGameContext'
import { useRouter } from 'next/router'
import { Player, Score } from '../services/types'

function msToHMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`
}

const scoreFields: { key: keyof Score; label: string }[] = [
  { key: 'reputation', label: 'Reputation Tiles' },
  { key: 'ambassador', label: 'Ambassador Tiles' },
  { key: 'sectors', label: 'Controlled Sectors' },
  { key: 'monoliths', label: 'Monoliths' },
  { key: 'discoveries', label: 'Discovery Tiles' },
  { key: 'tech', label: 'Tech Progress' },
  { key: 'bonus', label: 'Species Bonuses' },
]

export default function Home() {
  const router = useRouter()
  const { state, dispatch } = useGameContext()
  const { players } = state
  const focusedPlayer = getFocusedPlayer(state)

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
  }, [state, router])

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="h-20 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <StatBadge label="Game Over" />
          <StatBadge label="Turns" value={Math.ceil(state.turns.length / players.length)} />
          <StatBadge label="Time" value={msToHMS(getTotalGameTime(state))} />
        </div>
      </div>

      <div className="w-full flex justify-center pt-10">
        {focusedPlayer ? (
          <div className="uppercase w-96 divide-y divide-slate-200 border border-slate-200">
            <div className="flex justify-between p-4 bg-slate-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <FactionBadge factionId={focusedPlayer.factionId} size="small" />
                </div>
                <div className="ml-4">
                  <div className="text-xl font-medium text-slate-900 leading-none">
                    {focusedPlayer.name}
                  </div>
                  <FactionName className="text-gray-500" factionId={focusedPlayer.factionId} />
                </div>
              </div>
              <Button className="w-20" onClick={() => dispatch({ type: 'BLUR_PLAYER' })}>
                Done
              </Button>
            </div>
            <div className="grid gap-2 p-4">
              {scoreFields.map(({ key, label }) => (
                <div key={key} className="flex justify-between items-center gap-4">
                  <div className="text-xl">{label}</div>
                  <Input
                    type="number"
                    min={0}
                    className="w-20 text-center appearance-none hover:appearance-none"
                    value={focusedPlayer.score?.[key] ?? 0}
                    onFocus={e => e.currentTarget.select()}
                    onChange={e =>
                      dispatch({
                        type: 'UPDATE_PLAYER_SCORE',
                        data: {
                          playerId: focusedPlayer.id,
                          value: Number.isNaN(e.currentTarget.valueAsNumber)
                            ? 0
                            : e.currentTarget.valueAsNumber,
                          key,
                        },
                      })
                    }
                  />
                </div>
              ))}
              <div className="flex justify-between items-center gap-4">
                <div className="text-xl">Traitor Tile</div>
                <Checkbox
                  className="w-20 appearance-none hover:appearance-none"
                  value={focusedPlayer.score?.traitor === -2}
                  onChange={value =>
                    dispatch({
                      type: 'UPDATE_PLAYER_SCORE',
                      data: {
                        playerId: focusedPlayer.id,
                        value: value ? -2 : 0,
                        key: 'traitor',
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex p-4 justify-between">
              <div className="text-xl">Total</div>
              <div className="text-xl w-20 text-center">
                {Object.values(focusedPlayer.score ?? {}).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          </div>
        ) : (
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
                            <FactionName className="text-gray-500" factionId={player.factionId} />
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          className="w-full"
                          onClick={() =>
                            dispatch({ type: 'FOCUS_PLAYER', data: { playerId: player.id } })
                          }
                          hover={player.score != null}
                        >
                          {player.score
                            ? Object.values(player.score).reduce((a, b) => a + b)
                            : 'Set'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
