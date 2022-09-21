import { useContext, createContext, ReactNode, useRef, useCallback, useState } from 'react'

type Clock = {
  start: () => void
  pause: () => void
  subscribe: (subscriber: Subscriber) => () => void
  now: () => number
  isPaused: boolean
}

export const Context = createContext<Clock>({
  start: () => {},
  pause: () => {},
  subscribe: () => () => false,
  now: () => 0,
  isPaused: true,
})

type Props = {
  children: ReactNode
}

export function msToMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60)

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

type Subscriber = (elapsed: number) => void

export function ClockProvider({ children }: Props) {
  const elapsed = useRef<number>(0)
  const intervalId = useRef<NodeJS.Timer | null>(null)
  const subscribers = useRef<Set<Subscriber>>(new Set())
  const [isPaused, setIsPaused] = useState(true)

  const start = useCallback(() => {
    if (intervalId.current === null) {
      intervalId.current = setInterval(() => {
        elapsed.current += 1000

        subscribers.current.forEach(subscriber => subscriber(elapsed.current))
      }, 1000)
    }
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current)

      intervalId.current = null
    }
    setIsPaused(true)
  }, [])

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current.add(subscriber)

    return () => {
      subscribers.current.delete(subscriber)
    }
  }, [])

  const now = useCallback(() => elapsed.current, [])

  return (
    <Context.Provider value={{ start, pause, subscribe, now, isPaused }}>
      {children}
    </Context.Provider>
  )
}

export function useClock(): Clock {
  return useContext(Context)
}
