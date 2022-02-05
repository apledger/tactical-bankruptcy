/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'
import cn from 'classnames'
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '../components/Button'
import {
  getActiveTurn,
  getHasActivePlayerPassed,
  getHasPlayerPassed,
  getTotalPlayerTime,
  getOrderedPlayers,
  getIsActiveRoundDone,
  getActiveRoundTurns,
  getActiveRound,
} from '../services/selectors'
import { useHotkeys } from 'react-hotkeys-hook'
import { PlayerMarker } from '../components/PlayerMarker'
import { FactionBadge } from '../components/FactionBadge'
import { useGameContext } from '../services/useGameContext'
import { useRouter } from 'next/router'
import { IconButton } from '../components/IconButton'
import { StatBadge } from '../components/StatBadge'
import { CombatStars } from '../components/CombatStars'
import { msToMS, Timer } from '../components/Timer'

export default function Home() {
  const router = useRouter()
  const { state, dispatch, canUndo, canRedo } = useGameContext()
  const { players, activeRoundIndex, activePlayerIndex } = state
  const activeTurn = getActiveTurn(state)
  const activeRound = getActiveRound(state)
  const hasActivePlayerPassed = getHasActivePlayerPassed(state)
  const isRoundDone = getIsActiveRoundDone(state)
  const roundTurns = getActiveRoundTurns(state)

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
    if (state.activeRoundIndex === 8) router.push('/score')
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
        if (activeRoundIndex === null || activeRoundIndex === 0) {
          dispatch({ type: 'START_ROUND' })
        } else {
          router.push('/score')
        }
      }
    },
    [dispatch, hasActivePlayerPassed, activeTurn, activeRoundIndex],
  )
  useHotkeys(
    'enter, esc, tab',
    e => {
      e.preventDefault()

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
      <div className="h-20 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <StatBadge label={`Round ${(activeRoundIndex ?? 0) + 1}`} />
          {roundTurns.length > 0 && (
            <StatBadge label="Turn" value={Math.ceil(roundTurns.length / players.length)} />
          )}
          {activeTurn && activeRound.startTime && (
            <StatBadge label="Time" value={<Timer startTime={activeRound.startTime} />} />
          )}

          {isRoundDone && (
            <StatBadge
              label={
                <div className="flex items-center gap-2">
                  <CombatStars />
                  <span>Combat and Upkeep</span>
                </div>
              }
              color="orange"
            />
          )}
        </div>
        <div className="flex gap-2">
          <IconButton
            disabled={!canUndo}
            onClick={() => {
              dispatch({ type: 'UNDO' })
            }}
          >
            <FontAwesomeIcon icon={faUndo} />
          </IconButton>
          <IconButton
            disabled={!canRedo}
            onClick={() => {
              dispatch({ type: 'REDO' })
            }}
          >
            <FontAwesomeIcon icon={faRedo} />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto">
        <div
          className={cn(
            'flex gap-4 items-center justify-center',
            {
              2: 'grid-cols-2',
              3: 'grid-cols-3',
              4: 'grid-cols-4',
              5: 'grid-cols-5',
              6: 'grid-cols-6',
            }[players.length],
          )}
        >
          {getOrderedPlayers(state).map((player, index) => (
            <PlayerMarker
              key={player.id}
              player={player}
              startTime={activeTurn && index === activePlayerIndex ? activeTurn.startTime : null}
              totalTime={getTotalPlayerTime(state, player.id)}
              isActive={activeTurn != null && index === activePlayerIndex}
              isPassed={getHasPlayerPassed(state, player.id)}
              isHovered={isRoundDone}
            />
          ))}
        </div>
      </div>
      <div className="h-20 bg-white flex items-center justify-end p-4">
        {activeTurn && (
          <div className="flex gap-4 items-center">
            <div className="text-black uppercase text-lg">Done</div>
            <Button
              className="w-20"
              onClick={() => {
                dispatch({
                  type: 'END_PLAYER_TURN',
                  data: { type: hasActivePlayerPassed ? 'reaction' : 'action' },
                })
              }}
            >
              Space
            </Button>
          </div>
        )}
      </div>
      <div className="h-20 bg-black flex items-center justify-between p-4">
        <div className="flex gap-4">
          {activeRoundIndex === null ? (
            <>
              <StatBadge label="Ready to play?" />
            </>
          ) : activeRoundIndex < 7 ? (
            <>
              <StatBadge label={`Next Round: ${activeRoundIndex + 2}`} />
              <div className="flex gap-2">
                {getOrderedPlayers(state, activeRoundIndex + 1).map(player => (
                  <FactionBadge key={player.id} factionId={player.factionId} size="small" />
                ))}
              </div>
            </>
          ) : (
            <>
              <StatBadge label={`Last Round`} />
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {activeTurn ? (
            <>
              <div className="text-white uppercase text-lg">Pass</div>
              <Button
                className="w-20"
                color="white"
                onClick={() => {
                  dispatch({
                    type: 'END_PLAYER_TURN',
                    data: { type: 'pass' },
                  })
                }}
              >
                Tab
              </Button>
              <div className="text-white uppercase text-lg">Or</div>
              <Button
                className="w-20"
                color="white"
                onClick={() => {
                  dispatch({
                    type: 'END_PLAYER_TURN',
                    data: { type: 'pass' },
                  })
                }}
              >
                Enter
              </Button>
            </>
          ) : (
            <>
              <div className="text-white uppercase text-lg">
                {activeRoundIndex == null
                  ? 'Start Game'
                  : activeRoundIndex < 7
                  ? 'Start Next Round'
                  : 'End Game'}
              </div>
              <Button
                color="white"
                onClick={() => {
                  if (activeRoundIndex === null || activeRoundIndex === 0) {
                    dispatch({ type: 'START_ROUND' })
                  } else {
                    router.push('/score')
                  }
                }}
              >
                Space
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
