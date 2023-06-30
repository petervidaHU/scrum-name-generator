import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { NoteList } from '@/app/components/noteList'
import Portal from '@/app/portal';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
        <Portal>
          <NoteList />
        </Portal>
      </Provider>
    </>
  )
}

export default MyApp;