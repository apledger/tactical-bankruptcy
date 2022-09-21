import { AppProps } from 'next/app'

import '../styles/globals.css'
import { GameContextProvider } from '../services/useGameContext'
import { ClockProvider } from '../services/useClock'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClockProvider>
      <GameContextProvider>
        <Component {...pageProps} />
      </GameContextProvider>
    </ClockProvider>
  )
}

export default MyApp
