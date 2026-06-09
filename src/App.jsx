import './App.css'
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/tr";
import "dayjs/locale/tk";
import "dayjs/locale/ru";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";
import { useLocale } from './hooks/useLocale';

dayjs.extend(updateLocale);

dayjs.updateLocale("tk", {
  weekdays: [
    "Yekşenbe",
    "Duşenbe",
    "Sişenbe",
    "Çarşenbe",
    "Penşenbe",
    "Anna",
    "Şenbe"
  ],
  weekdaysShort: ["Ye", "Du", "Şi", "Ça", "Pe", "An", "Şe"],
  weekdaysMin: ["Ye", "Du", "Şi", "Ça", "Pe", "An", "Şe"],
  months: [
    "Ýanwar",
    "Fewral",
    "Mart",
    "Aprel",
    "Maý",
    "Iýun",
    "Iýul",
    "Awgust",
    "Sentýabr",
    "Oktýabr",
    "Noýabr",
    "Dekabr"
  ],
  monthsShort: [
    "Ýan",
    "Few",
    "Mar",
    "Apr",
    "Maý",
    "Iýn",
    "Iýl",
    "Awg",
    "Sen",
    "Okt",
    "Noý",
    "Dek"
  ],
  weekStart: 1,
  relativeTime: {
    future: "%s soň",
    past: "%s öň",
    s: "birnäçe sekunt",
    m: "bir minut",
    mm: "%d minut",
    h: "bir sagat",
    hh: "%d sagat",
    d: "bir gün",
    dd: "%d gün",
    M: "bir aý",
    MM: "%d aý",
    y: "bir ýyl",
    yy: "%d ýyl"
  }
});


function App() {

  const { t, currentLanguage } = useLocale();

  useEffect(() => {
    let unsubscribe;

    messaging.then((m) => {
      if (m) {
        unsubscribe = onMessage(m, (payload) => {
          console.log('Message received. ', payload);
          toast.info(payload.notification?.title || t("notifications.newNotification"));

          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
          notifications.push({
            ...payload.notification,
            id: Date.now(),
            unread: true,
            date_time: new Date().toISOString()
          });
          localStorage.setItem("notifications", JSON.stringify(notifications));
          window.dispatchEvent(new Event('notifications-updated'));
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={currentLanguage} >
      <ToastContainer position="bottom-right" />
      <RouterProvider router={routes} />
    </LocalizationProvider>
  )
}


export default App;
