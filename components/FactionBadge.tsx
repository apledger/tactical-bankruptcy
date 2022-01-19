import classNames from 'classnames'
import Image from 'next/image'
import { ComponentPropsWithoutRef } from 'react'

import { factions } from '../services/factions'

type BaseProps = {
  factionId: string
  size?: 'small' | 'medium' | 'large'
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export function FactionBadge({ factionId, size = 'medium', className, ...rest }: Props) {
  const faction = factions.find(faction => faction.id === factionId)

  return faction ? (
    <div
      {...rest}
      className={classNames('relative rounded-full transition-all', className)}
      style={{
        width: { small: 60, medium: 150, large: 300 }[size],
        height: { small: 60, medium: 150, large: 300 }[size],
        backgroundColor: faction.color,
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all">
        <Image
          alt={`${faction.name} icon`}
          src={faction.icon}
          width={{ small: 30, medium: 60, large: 150 }[size]}
          height={{ small: 30, medium: 60, large: 150 }[size]}
        />
      </div>
    </div>
  ) : (
    <div>Not Found</div>
  )
}