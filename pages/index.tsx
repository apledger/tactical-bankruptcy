/* eslint-disable react/no-unescaped-entities */

import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useGameContext } from '../services/useGameContext'

export default function Home() {
  const router = useRouter()
  const { state } = useGameContext()

  useEffect(() => {
    if (state.players.length === 0) router.push('/setup')
    else router.push('/play')
  }, [state, router])

  return <div className="h-screen flex items-center justify-center uppercase">Loading...</div>
}
