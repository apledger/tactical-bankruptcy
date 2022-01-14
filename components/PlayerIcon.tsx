import { ComponentPropsWithoutRef } from 'react'

import { Player } from '../services/types'
import SvgDraco from '../Draco'
import SvgEridani from '../lib/icons/Eridani'
import SvgHydrani from '../lib/icons/Hydrani'
import SvgMech from '../lib/icons/Mech'
import SvgOrion from '../lib/icons/Orion'
import SvgPlanta from '../lib/icons/Planta'
import SvgTerran from '../lib/icons/Terran'

type BaseProps = {
  player: Player
  size: 'small' | 'medium' | 'large'
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'svg'>, keyof BaseProps>

const sizes = {
  small: '50%',
  medium: '100%',
  large: '150%',
}

export function PlayerIcon({ player, size, ...rest }: Props) {
  if (player.isAlien === false) return <SvgTerran {...rest} width={sizes[size]} />

  switch (player.color) {
    case 'red':
      return <SvgEridani {...rest} width={sizes[size]} />
    case 'blue':
      return <SvgHydrani {...rest} className="mb-1" width={sizes[size]} />
    case 'yellow':
      return <SvgDraco {...rest} width={sizes[size]} />
    case 'lightGray':
      return <SvgMech {...rest} width={sizes[size]} />
    case 'darkGray':
      return <SvgOrion {...rest} width={sizes[size]} />
    case 'green':
      return <SvgPlanta {...rest} width={sizes[size]} />
  }
}
