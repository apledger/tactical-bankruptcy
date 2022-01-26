import classNames from 'classnames'
import { ComponentPropsWithoutRef } from 'react'

import { FactionBadge } from './FactionBadge'

import { factions } from '../services/factions'

type BaseProps = {
  active?: boolean
  disabled?: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof FactionBadge>, keyof BaseProps>

export function FactionButton({ active, disabled, className, onClick, ...rest }: Props) {
  return (
    <button onClick={onClick}>
      <FactionBadge {...rest} />
    </button>
  )
}
