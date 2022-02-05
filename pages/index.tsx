/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useGameContext } from '../services/useGameContext'

function msToHMS(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`
}

export default function Home() {
  const router = useRouter()
  const { state } = useGameContext()

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
    else router.push('/play')
  }, [state, router])

  return <div className="h-screen flex items-center justify-center uppercase">Loading...</div>
}
