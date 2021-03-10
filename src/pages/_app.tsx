import Head from 'next/head'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import '@shopify/polaris/dist/styles.css'

function TodoApp({ Component, pageProps }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Head>
        <title>Todo App</title>
      </Head>
      
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default TodoApp
