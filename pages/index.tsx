/* eslint-disable react/no-unescaped-entities */

import { useEffect, useReducer, useState } from 'react'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

import { Player, Color, Turn, Round } from '../services/types'
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
} from '../services/selectors'

export const colors: Color[] = ['gray', 'red', 'blue', 'black', 'yellow', 'green']

export default function Home() {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const { players, activeRoundIndex } = state
  const activePlayer = getActivePlayer(state)
  const activeRound = getActiveRound(state)
  const nextRound = getNextRound(state)
  const activeTurn = getActiveTurn(state)
  const hasActivePlayerPassed = getHasActivePlayerPassed(state)

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="h-24 bg-black flex items-center p-4 text-lg font-display text-white justify-center uppercase">
          <FontAwesomeIcon className="fill-current text-white mr-3" icon={faCoins} size="lg" />
          Tactical Bankruptcy
        </div>
        <div className="flex-1 p-4 flex flex-col items-center gap-4">
          {activeTurn ? (
            <>
              <p className="text-xl mb-2">{activePlayer.name}, you're up</p>
              <Timer startTime={activeTurn.startTime} />
            </>
          ) : (
            <p className="text-xl mb-2">{activePlayer.name}, are you ready?</p>
          )}

          {activeRound.startTime ? (
            <>
              <Button
                onClick={() => {
                  dispatch({
                    type: 'END_PLAYER_TURN',
                    data: { type: hasActivePlayerPassed ? 'reaction' : 'action' },
                  })
                }}
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  dispatch({ type: 'END_PLAYER_TURN', data: { type: 'pass' } })
                }}
              >
                Passed
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                dispatch({ type: 'START_ROUND' })
              }}
            >
              Start Round {activeRoundIndex + 1}
            </Button>
          )}
        </div>
        <div className="h-24 bg-black flex flex-col items-center p-4 gap-2">
          <div className="text-sm font-display text-white justify-center uppercase">Next Round</div>
          <div
            className={cn(
              'grid gap-2',
              {
                2: 'grid-cols-2',
                3: 'grid-cols-3',
                4: 'grid-cols-4',
                5: 'grid-cols-5',
                6: 'grid-cols-6',
              }[players.length],
            )}
          >
            {nextRound?.playerOrder.map(color => (
              <TurnMarker key={color} color={color} isActive={false} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
