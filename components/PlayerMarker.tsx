import classNames from 'classnames'
import { ComponentPropsWithoutRef } from 'react'
import { motion, MotionProps } from 'framer-motion'

import { Player } from '../services/types'
import { FactionBadge } from './FactionBadge'
import { Timer, msToMS } from './Timer'

type BaseProps = {
  player: Player
  startTime: number | null
  totalTime: number
  roundTime: number
  roundActions: number
  roundReactions: number
  isPassed: boolean
  isActive: boolean
  isHovered: boolean
}

type Props = BaseProps & MotionProps & ComponentPropsWithoutRef<'div'>

export function PlayerMarker({
  player,
  startTime,
  isPassed,
  isActive = false,
  totalTime,
  roundTime,
  roundActions,
  roundReactions,
  isHovered = false,
  className,
  ...rest
}: Props) {
  return (
    <motion.div {...rest} className={classNames(className, 'relative group')}>
      <div className="uppercase flex justify-center text-center w-full absolute bottom-full mb-3">
        {isActive ? (
          <div className="text-3xl"> {player.name}</div>
        ) : (
          <div
            className={classNames(
              'text-2xl transition-opacity',
              !isHovered && 'opacity-0 group-hover:opacity-100',
            )}
          >
            {player.name}
          </div>
        )}
      </div>
      <FactionBadge
        iconOpacity={isPassed ? 0.5 : 1}
        factionId={player.factionId}
        size={isActive ? 'large' : 'medium'}
      />
      {isPassed && (
        <div
          className={classNames(
            `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12
          text-white caps bg-black flex items-center justify-center uppercase transition-all border border-white`,
            isActive ? 'w-48 h-12 text-md' : 'w-24 h-10 text-sm',
          )}
        >
          Passed
        </div>
      )}
      <div className="absolute top-full w-full mt-3">
        {isActive ? (
          startTime != null && (
            <div className="grid gap-3 text-center uppercase">
              <Timer className="text-3xl" startTime={startTime} />
              <div className="text-2xl text-zinc-600">{`${roundActions} ${
                roundActions === 1 ? 'action' : 'actions'
              }`}</div>
              {roundReactions > 0 && (
                <div className="text-xl text-zinc-600">{`${roundReactions} ${
                  roundReactions === 1 ? 'reaction' : 'reactions'
                }`}</div>
              )}
            </div>
          )
        ) : (
          <div
            className={classNames(
              'transition-opacity grid uppercase text-center',
              !isHovered && 'opacity-0 group-hover:opacity-100',
            )}
          >
            <div className="text-2xl mb-3">{msToMS(roundTime)}</div>
            <div className="text-lg text-zinc-600">{`${roundActions} ${
              roundActions === 1 ? 'action' : 'actions'
            }`}</div>
            {roundReactions > 0 && (
              <div className="text-lg text-zinc-600">{`${roundReactions} ${
                roundReactions === 1 ? 'reaction' : 'reactions'
              }`}</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
