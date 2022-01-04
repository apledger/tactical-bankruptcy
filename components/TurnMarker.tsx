import cn from 'classnames'

import { Color } from '../services/types'

type Props = {
  color: Color
  isActive: boolean
}

export function TurnMarker({ color, isActive }: Props) {
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full',
        {
          gray: 'bg-gray',
          red: 'bg-red',
          blue: 'bg-blue',
          black: 'bg-black',
          yellow: 'bg-yellow',
          green: 'bg-green',
        }[color],
      )}
    />
  )
}
