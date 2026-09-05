import '../styles/globals.css'
import Analytics from '../components/Analytics'
import SmoothHashScroll from '../components/SmoothHashScroll'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SmoothHashScroll />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
