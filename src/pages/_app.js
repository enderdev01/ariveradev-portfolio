import { Shippori_Mincho, Zen_Kaku_Gothic_New } from '@next/font/google'
import '../styles/globals.css'
import Analytics from '../components/Analytics'
import SmoothHashScroll from '../components/SmoothHashScroll'

// Headings: a sharp, formal mincho serif. Running text: a quiet Japanese gothic.
const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

const zenKakuGothic = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-display: ${shipporiMincho.style.fontFamily};
          --font-sans: ${zenKakuGothic.style.fontFamily};
        }
      `}</style>
      <SmoothHashScroll />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
