import classNames from 'classnames'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'

type BaseProps = {
  startTime: number
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

function msToMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60)

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export function Timer({ startTime, className, ...rest }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(Date.now() - startTime)

    const intervalId = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [startTime])

  useEffect(() => {
    if (elapsed > 10 * 1000) {
      const audo = new Audio('./public/Brass.mp3')
    }
  }, [elapsed])

  return (
    <div {...rest} className={classNames('text-xl', className)}>
      {msToMS(elapsed)}
    </div>
  )
}
