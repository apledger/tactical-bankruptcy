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
  isHovered = false,
  className,
  ...rest
}: Props) {
  return (
    <motion.div {...rest} className={classNames(className, 'relative group')}>
      <div className="uppercase flex justify-center w-full absolute bottom-full mb-3">
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
      <div className="uppercase flex justify-center w-full absolute top-full mt-3">
        {isActive ? (
          startTime != null && <Timer className="text-3xl" startTime={startTime} />
        ) : (
          <div
            className={classNames(
              'text-2xl transition-opacity',
              !isHovered && 'opacity-0 group-hover:opacity-100',
            )}
          >
            {msToMS(totalTime)}
          </div>
        )}
      </div>
    </motion.div>
  )
}
