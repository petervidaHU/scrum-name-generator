import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { NoteList } from '@/app/components/notificationItems/noteList'
import Portal from '@/app/portal';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
          <Portal>
            <NoteList />
          </Portal>
        </Provider>
      </ThemeProvider>
    </>
  )
}

export default MyApp;