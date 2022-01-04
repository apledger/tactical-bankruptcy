import Document, { Html, Head, Main, NextScript } from 'next/document'
import { config } from '@fortawesome/fontawesome-svg-core'

config.autoAddCss = false

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Oxygen+Mono&family=Oxygen:wght@300;400;700&family=Unica+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
