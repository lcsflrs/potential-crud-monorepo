/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <title>Me Contrata - Não perca essa oportunidade!</title>
          <meta name="description" content="Feito por Lucas Flores" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          {/* Fonts */}
          <link
            href="https://fonts.googleapis.com/css?family=Blinker:400,600,800&display=swap"
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
