import { useEffect, useState } from 'react'

type Props = {
  startTime: number
}

function msToHMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60)

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export function Timer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(Date.now() - startTime)

    const intervalId = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [startTime])

  return <div className="text-5xl font-mono font-bold">{msToHMS(elapsed)}</div>
}
