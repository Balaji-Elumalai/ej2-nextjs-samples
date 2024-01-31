'use client';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Home from './page'
import { useEffect, useLayoutEffect, useState } from 'react'
import { select } from '@syncfusion/ej2-base';

const inter = Inter({ subsets: ['latin'] })

// const metadata: Metadata = {
//   title: 'Demos, Examples of Syncfusion Next.js React UI Components',
//   description: 'Explore and learn Syncfusion Next.js React UI components library using large collection of feature-wise examples for each components.',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [theme, setTheme] = useState('material');
  // useEffect(() => {
  //   let sbBodyOverlay = select('.sb-body-overlay') as HTMLElement;
  //   setTimeout(() => {
  //     if (!sbBodyOverlay.classList.contains('sb-hide')) {
  //       sbBodyOverlay.classList.add('sb-hide');
  //     }
  //   }
  //     , 600);
  //   // if (!sbBodyOverlay.classList.contains('sb-hide')) {
  //   //   sbBodyOverlay.classList.add('sb-hide');
  //   // }
  // }, [theme])





  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"></meta>
        <meta name="description" content="Explore and learn Syncfusion Next.js React UI components library using large collection of feature-wise examples for each components."></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <title>Demos, Examples of Syncfusion Next.js React UI Components</title>
        <link href="/common/lib/content/roboto.css" rel="stylesheet" />
        <link href="/common/lib/content/bootstrap.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
        <link href={'/styles/' + theme + '.css'} rel="stylesheet"></link>
        <link rel="stylesheet" href="/common/codemirror/lib/codemirror.css" />
        <link rel="stylesheet" href="/common/codemirror/theme/mbo.css" />
        <link rel='stylesheet' href='/styles/index.css'></link>
        <script src="/common/codemirror/lib/codemirror.js" defer ></script>
        <script src="/common/codemirror/mode/javascript/javascript.js" defer ></script>
        <script src="/common/codemirror/mode/jsx/jsx.js" defer ></script>
        <script src="/common/codemirror/mode/xml/xml.js" defer ></script>
        <script src="/common/codemirror/mode/css/css.js" defer ></script>
      </head>
      <body className={theme + ' ' + inter.className}>
        <Home theme={theme} setTheme={setTheme}>{children}</Home>
      </body>
    </html>
  )
}
