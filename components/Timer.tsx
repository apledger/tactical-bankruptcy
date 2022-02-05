import classNames from 'classnames'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { useTimer } from '../services/useTimer'

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
  const { elapsed } = useTimer(startTime)

  return (
    <div {...rest} className={classNames('uppercase', className)}>
      {msToMS(elapsed)}
    </div>
  )
}
