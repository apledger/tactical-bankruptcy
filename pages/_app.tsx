import { AppProps } from 'next/app'

import '../styles/globals.css'
import { GameContextProvider } from '../services/useGameContext'
import { TimerProvider } from '../services/useTimer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TimerProvider>
      <GameContextProvider>
        <Component {...pageProps} />
      </GameContextProvider>
    </TimerProvider>
  )
}

export default MyApp
