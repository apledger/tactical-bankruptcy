import classNames from 'classnames'
import { ComponentPropsWithoutRef } from 'react'

import { Player } from '../services/types'
import { PlayerIcon } from './PlayerIcon'

type BaseProps = {
  player: Player
  size: 'small' | 'medium' | 'large'
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export function PlayerBadge({ player, isPassed, size, ...rest }) {
  return (
    <div
      className={classNames(
        'relative rounded-full flex items-center justify-center fill-current text-white',
        {
          lightGray: 'bg-lightGray',
          red: 'bg-red',
          blue: 'bg-blue',
          darkGray: 'bg-darkGray',
          yellow: 'bg-yellow',
          green: 'bg-green',
        }[player.color],
        {
          small: 'w-16 h-16',
          medium: 'w-36 h-36',
          large: 'w-75 h-75',
        }[size],
      )}
    >
      <PlayerIcon player={player} size={size} />
      {isPassed && (
        <div className="p-2 text-xs rounded-sm bg-black text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Passed
        </div>
      )}
    </div>
  )
}
