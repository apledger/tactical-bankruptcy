import { AppProps } from 'next/app'

import '../styles/globals.css'
import { GameContextProvider } from '../services/useGameContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameContextProvider>
      <Component {...pageProps} />
    </GameContextProvider>
  )
}

export default MyApp
