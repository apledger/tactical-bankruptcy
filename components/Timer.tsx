import classNames from 'classnames'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { useClock } from '../services/useClock'

type BaseProps = {
  startTime: number
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export function msToMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60)

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export function Timer({ startTime, className, ...rest }: Props) {
  const clock = useClock()
  const [elapsed, setElapsed] = useState(clock.now())

  useEffect(() => clock.subscribe(setElapsed), [clock])

  return (
    <div {...rest} className={classNames('uppercase', className)}>
      {msToMS(elapsed - startTime)}
    </div>
  )
}
