import { Fraunces } from '@next/font/google'
import '../styles/globals.css'
import Analytics from '../components/Analytics'
import SmoothHashScroll from '../components/SmoothHashScroll'

// Display face for headings only; running text keeps the neutral system stack.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-display: ${fraunces.style.fontFamily};
        }
      `}</style>
      <SmoothHashScroll />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
