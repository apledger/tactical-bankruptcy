import Document, { Html, Head, Main, NextScript } from 'next/document'
import { config } from '@fortawesome/fontawesome-svg-core'
import { GameContextProvider } from '../services/useGameContext'

config.autoAddCss = false

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Unica+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <GameContextProvider>
            <Main />
            <NextScript />
          </GameContextProvider>
        </body>
      </Html>
    )
  }
}

export default MyDocument
