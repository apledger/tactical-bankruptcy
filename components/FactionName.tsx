import classNames from 'classnames'
import { ComponentPropsWithoutRef } from 'react'

import { factions } from '../services/factions'

type BaseProps = {
  factionId: string
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export function FactionName({ factionId, className, ...rest }: Props) {
  const faction = factions.find(faction => faction.id === factionId)

  return faction ? (
    <div {...rest} className={classNames('text-sm', className)}>
      {faction.name}
    </div>
  ) : (
    <div>Not Found</div>
  )
}
