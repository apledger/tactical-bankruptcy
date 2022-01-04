/* eslint-disable react/no-unescaped-entities */

import { useReducer } from 'react'
import cn from 'classnames'
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '../components/Button'
import { msToHMS, Timer } from '../components/Timer'
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
} from '../services/selectors'
import { useHistoryReducer } from '../services/useHistoryReducer'

export default function Home() {
  const [{ present: state, past, future }, dispatch] = useHistoryReducer(reducer, defaultState)
  const { players, activeRoundIndex, activePlayerIndex } = state
  const activePlayer = getActivePlayer(state)
  const activeRound = getActiveRound(state)
  const nextRound = getNextRound(state)
  const activeTurn = getActiveTurn(state)
  const hasActivePlayerPassed = getHasActivePlayerPassed(state)

  return (
    <div className="h-screen flex flex-col">
      {activeRoundIndex < 8 ? (
        <>
          <div className="h-24 bg-black flex items-center relative">
            {past.length > 0 && (
              <div className="absolute left-0 ml-4">
                <div
                  className="cursor-pointer bg-white rounded p-2 text-xs flex items-center gap-1"
                  onClick={() => {
                    dispatch({ type: 'UNDO' })
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} className="fill-current text-black/75" />
                  Undo
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="text-sm font-display text-white justify-center uppercase">
                Round {activeRoundIndex + 1}
              </div>
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
                {activeRound.playerOrder.map((color, index) => (
                  <TurnMarker
                    key={color}
                    color={color}
                    isActive={index === activePlayerIndex}
                    isPassed={getHasPlayerPassed(state, color)}
                  />
                ))}
              </div>
            </div>
            {future.length > 0 && (
              <div className="absolute right-0 mr-4">
                <div
                  className="cursor-pointer bg-white rounded p-2 text-xs flex items-center gap-1"
                  onClick={() => {
                    dispatch({ type: 'REDO' })
                  }}
                >
                  <FontAwesomeIcon icon={faRedo} className="fill-current text-black/75" />
                  Redo
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col items-center gap-4 max-w-lg w-full mx-auto">
            {activeTurn ? (
              <>
                <p className="text-xl mb-2">{activePlayer.name}, you're up</p>
                <Timer startTime={activeTurn.startTime} />
              </>
            ) : (
              <p className="text-xl mb-2">Ready to play?</p>
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
                  Pass
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
            <div className="text-sm font-display text-white justify-center uppercase">
              Next Round
            </div>
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
                <TurnMarker key={color} color={color} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-24 bg-black flex flex-col items-center justify-center">
            <div className="text-md font-display text-white uppercase">Game Over</div>
          </div>
          <div className="grid p-5 max-w-lg mx-auto w-full">
            {players.map(player => (
              <div key={player.color} className="flex justify-between p-4 border-b border-black/25">
                <div className="flex gap-3 items-center">
                  <TurnMarker color={player.color} />
                  <div className="text-lg">{player.name}</div>
                </div>
                <div className="text-lg font-mono font-bold">
                  {msToHMS(getTotalPlayerTime(state, player.color))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
