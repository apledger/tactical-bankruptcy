import classNames from 'classnames'
import Image from 'next/image'
import { ComponentPropsWithoutRef } from 'react'

import { factions } from '../services/factions'

type BaseProps = {
  factionId: string
  size?: 'small' | 'medium' | 'large'
  iconOpacity?: number
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

export function FactionBadge({
  factionId,
  size = 'medium',
  className,
  iconOpacity = 1,
  ...rest
}: Props) {
  const faction = factions.find(faction => faction.id === factionId)

  return faction ? (
    <button
      {...rest}
      className={classNames(
        'relative rounded-full transition-all',
        {
          small: 'w-[48px] h-[48px]',
          medium: 'w-[100px] h-[100px] md:w-[150px] md:h-[150px]',
          large: 'w-[300px] h-[300px]',
        }[size],
        className,
      )}
      style={{ backgroundColor: faction.color }}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all inline-flex"
        style={{ opacity: iconOpacity }}
      >
        <Image
          draggable="false"
          alt={`${faction.name} icon`}
          src={faction.icon}
          width={{ small: 30, medium: 60, large: 150 }[size]}
          height={{ small: 30, medium: 60, large: 150 }[size]}
        />
      </div>
    </button>
  ) : (
    <div>Not Found</div>
  )
}
