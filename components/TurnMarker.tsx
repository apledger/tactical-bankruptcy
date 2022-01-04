import cn from 'classnames'
import { faCaretUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Color } from '../services/types'

type Props = {
  color: Color
  isActive?: boolean
  isPassed?: boolean
}

export function TurnMarker({ color, isActive, isPassed }: Props) {
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full relative flex items-center justify-center',
        {
          lightGray: 'bg-lightGray',
          red: 'bg-red',
          blue: 'bg-blue',
          darkGray: 'bg-darkGray',
          yellow: 'bg-yellow',
          green: 'bg-green',
        }[color],
      )}
    >
      {isPassed && <FontAwesomeIcon className="fill-current text-white" icon={faTimes} />}
      {isActive && (
        <FontAwesomeIcon
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1/2 fill-current text-white"
          icon={faCaretUp}
        />
      )}
    </div>
  )
}
