/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'
import classNames from 'classnames'
import {
  faArrowAltCircleDown,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHotkeys } from 'react-hotkeys-hook'

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
  getIsLastRound,
  getRoundPlayerTime,
  getRoundPlayerActions,
  getRoundPlayerReactions,
} from '../services/selectors'
import { PlayerMarker } from '../components/PlayerMarker'
import { FactionBadge } from '../components/FactionBadge'
import { useGameContext } from '../services/useGameContext'
import { useRouter } from 'next/router'
import { IconButton } from '../components/IconButton'
import { StatBadge } from '../components/StatBadge'
import { CombatStars } from '../components/CombatStars'
import { msToMS, Timer } from '../components/Timer'
import { useClock } from '../services/useClock'

export default function Home() {
  const router = useRouter()
  const { state, dispatch, canUndo, canRedo } = useGameContext()
  const { players, activeRoundIndex, activePlayerIndex } = state
  const activeTurn = getActiveTurn(state)
  const activeRound = getActiveRound(state)
  const hasActivePlayerPassed = getHasActivePlayerPassed(state)
  const isRoundDone = getIsActiveRoundDone(state)
  const roundTurns = getActiveRoundTurns(state)
  const isLastRound = getIsLastRound(state)
  const clock = useClock()

  function startRound() {
    clock.start()

    dispatch({ type: 'START_ROUND', data: { time: clock.now() } })
  }

  function submitAction() {
    dispatch({
      type: 'END_PLAYER_TURN',
      data: { type: hasActivePlayerPassed ? 'reaction' : 'action', time: clock.now() },
    })
  }

  function submitPass() {
    dispatch({
      type: 'END_PLAYER_TURN',
      data: { type: 'pass', time: clock.now() },
    })
  }

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
    if (state.activeRoundIndex === 8) router.push('/score')
  }, [state, router])

  useHotkeys('cmd+z, ctrl+z', () => dispatch({ type: 'UNDO' }), [dispatch])
  useHotkeys('cmd+y, ctrl+y', () => dispatch({ type: 'REDO' }), [dispatch])
  useHotkeys(
    'space',
    e => {
      e.preventDefault()

      if (activeTurn) {
        submitAction()
      } else {
        if (isLastRound) {
          router.push('/score')
        } else {
          startRound()
        }
      }
    },
    [dispatch, hasActivePlayerPassed, activeTurn, isLastRound],
  )

  // Use * here because 'shift' doesn't fire
  useHotkeys(
    '*',
    e => {
      if (e.key === 'Shift' && activeTurn) {
        e.preventDefault()

        submitPass()
      }
    },
    [dispatch, activeTurn],
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="h-20 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <StatBadge label={`Round ${(activeRoundIndex ?? 0) + 1}`} />
          {roundTurns.length > 0 && (
            <StatBadge label="Turn" value={Math.ceil(roundTurns.length / players.length)} />
          )}
          {activeRound.startTime != null && (
            <StatBadge
              label="Time"
              value={
                isRoundDone && activeRound.endTime != null ? (
                  <span>{msToMS(activeRound.endTime - activeRound.startTime)}</span>
                ) : (
                  <Timer startTime={activeRound.startTime} />
                )
              }
            />
          )}

          {isRoundDone && activeRound.endTime != null && (
            <>
              <StatBadge
                label={
                  <div className="flex items-center gap-2">
                    <CombatStars />
                    <span>Combat and Upkeep</span>
                  </div>
                }
                color="orange"
              />
              <StatBadge
                label="Time"
                color="orange"
                value={<Timer startTime={activeRound.endTime} />}
              />
            </>
          )}
        </div>
        <div className="flex gap-4">
          <IconButton
            disabled={!canUndo}
            onClick={() => {
              dispatch({ type: 'UNDO' })
            }}
          >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
          </IconButton>
          <IconButton
            disabled={!canRedo}
            onClick={() => {
              dispatch({ type: 'REDO' })
            }}
          >
            <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className={classNames(
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
              layout
              player={player}
              startTime={activeTurn && index === activePlayerIndex ? activeTurn.startTime : null}
              totalTime={getTotalPlayerTime(state, player.id)}
              roundTime={getRoundPlayerTime(state, player.id)}
              roundActions={getRoundPlayerActions(state, player.id)}
              roundReactions={getRoundPlayerReactions(state, player.id)}
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
            <div className="text-black uppercase text-lg">
              {hasActivePlayerPassed ? 'Reaction' : 'Action'}
            </div>
            <Button className="w-20" onClick={submitAction}>
              Space
            </Button>
          </div>
        )}
      </div>
      <div className="h-20 bg-black flex items-center justify-between p-4">
        <div className="flex gap-4">
          {activeRoundIndex === null ? (
            <>
              <StatBadge label="Ready to play?" color="clearLight" />
            </>
          ) : activeRoundIndex < 7 ? (
            <>
              <StatBadge label={`Next Round: ${activeRoundIndex + 2}`} color="clearLight" />
              <div className="flex gap-2">
                {getOrderedPlayers(state, activeRoundIndex + 1).map(player => (
                  <FactionBadge key={player.id} factionId={player.factionId} size="small" />
                ))}
              </div>
            </>
          ) : (
            <>
              <StatBadge label={`Last Round`} color="clearLight" />
            </>
          )}
        </div>
        <div className="flex gap-4 items-center relative">
          {activeTurn ? (
            <>
              <div className="text-white uppercase text-lg">Pass</div>
              <Button className="w-20" color="white" onClick={submitPass}>
                Shift
              </Button>
            </>
          ) : (
            <>
              <div className="text-white uppercase text-lg">
                {isLastRound
                  ? 'End Game'
                  : activeRoundIndex === null
                  ? 'Start Game'
                  : 'Start Next Round'}
              </div>
              <Button
                className="relative"
                color="white"
                onClick={() => {
                  if (isLastRound) {
                    router.push('/score')
                  } else {
                    startRound()
                  }
                }}
              >
                Space
                {activeRoundIndex === null && (
                  <div className="absolute bottom-full mb-5 left-1/2 transform -translate-x-1/2">
                    <FontAwesomeIcon
                      icon={faArrowAltCircleDown}
                      className="animate-bounce text-black"
                      size="2x"
                    />
                  </div>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
