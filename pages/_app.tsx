import '../styles/globals.css'
import { GameContextProvider } from '../services/useGameContext'

function MyApp({ Component, pageProps }) {
  return (
    <GameContextProvider>
      <Component {...pageProps} />
    </GameContextProvider>
  )
}

export default MyApp
