import '../styles/globals.css';
import 'react-notifications/lib/notifications.css';

import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function MyApp({ Component, pageProps }) {

  const err = (title, text) => NotificationManager.error(text, title, 8000);
  const info = (title, text) => NotificationManager.success(text, title, 80000);

  return (
    <>
      <NotificationContainer />
      <Component {...pageProps} err={err} info={info} />
    </>
  )
}