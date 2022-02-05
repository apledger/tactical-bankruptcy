import {
  useContext,
  createContext,
  useEffect,
  ReactNode,
  useState,
  useRef,
  useCallback,
} from 'react'

type Callback = (elapsed: number) => void
type Timer = { startTime: number; callback: Callback }

type Context = {
  registerTimer: (startTime: number, callback: Callback) => () => void
}

export const Context = createContext<Context>({
  registerTimer: () => () => {},
})

type Props = {
  children: ReactNode
}

export function msToMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60)

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export function TimerProvider({ children }: Props) {
  const timers = useRef(new Set<Timer>())

  const registerTimer = useCallback((startTime: number, callback: Callback) => {
    const timer = { startTime, callback }

    timers.current.add(timer)

    return () => timers.current.delete(timer)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      timers.current.forEach(({ startTime, callback }) => {
        callback(Date.now() - startTime)
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <Context.Provider value={{ registerTimer }}>{children}</Context.Provider>
}

export function useTimer(startTime: number): { elapsed: number } {
  const { registerTimer } = useContext(Context)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => registerTimer(startTime, setElapsed), [registerTimer, startTime])

  return { elapsed }
}
