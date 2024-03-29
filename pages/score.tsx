/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'

import {
  getTotalPlayerTime,
  getTotalGameTime,
  getTotalPlayerActions,
  getTotalPlayerReactions,
  getFocusedPlayer,
  getPlayerLongestTurn,
} from '../services/selectors'
import { FactionBadge } from '../components/FactionBadge'
import { FactionName } from '../components/FactionName'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { TraitorCheckbox } from '../components/TraitorCheckbox'
import { StatBadge } from '../components/StatBadge'
import { useGameContext } from '../services/useGameContext'
import { useRouter } from 'next/router'
import { Score } from '../services/types'
import { msToMS } from '../components/Timer'

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

      <div className="pt-10 overflow-auto">
        {focusedPlayer ? (
          <form
            className="uppercase w-96 divide-y divide-zinc-200 border border-zinc-200 m-auto"
            onSubmit={() => {
              console.log('submitting')
              dispatch({ type: 'BLUR_PLAYER' })
            }}
          >
            <div className="flex justify-between p-4 bg-zinc-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <FactionBadge factionId={focusedPlayer.factionId} size="small" />
                </div>
                <div className="ml-4">
                  <div className="text-xl font-medium leading-none">{focusedPlayer.name}</div>
                  <FactionName className="text-gray-500" factionId={focusedPlayer.factionId} />
                </div>
              </div>
              <Button className="w-20" type="submit">
                Done
              </Button>
            </div>
            <div className="grid gap-2 p-4">
              {scoreFields.map(({ key, label }) => (
                <div key={key} className="flex justify-between items-center gap-4">
                  <label htmlFor={key} className="text-xl">
                    {label}
                  </label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    className="w-20 text-center appearance-none hover:appearance-none"
                    value={focusedPlayer.score?.[key]}
                    onChange={e =>
                      dispatch({
                        type: 'UPDATE_PLAYER_SCORE',
                        data: {
                          playerId: focusedPlayer.id,
                          value: Number.isNaN(e.currentTarget.valueAsNumber)
                            ? undefined
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
                <TraitorCheckbox
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
                {Object.values(focusedPlayer.score ?? {}).reduce((a = 0, b = 0) => a + b, 0)}
              </div>
            </div>
          </form>
        ) : (
          <div className="max-w-5xl m-auto">
            <table className="min-w-full divide-y divide-zinc-200 border border-zinc-200">
              <thead className="bg-zinc-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Player
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Reactions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Longest Turn
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Total Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200 uppercase">
                {players.map(player => {
                  return (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <FactionBadge factionId={player.factionId} size="small" />
                          </div>
                          <div className="ml-4">
                            <div className="text-xl font-medium leading-none">{player.name}</div>
                            <FactionName className="text-gray-500" factionId={player.factionId} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xl">{getTotalPlayerActions(state, player.id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xl">{getTotalPlayerReactions(state, player.id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xl">
                          {msToMS(getPlayerLongestTurn(state, player.id))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xl">
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
                            ? Object.values(player.score).reduce((a = 0, b = 0) => a + b)
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
