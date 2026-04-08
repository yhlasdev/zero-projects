import './App.css'
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/tr";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(updateLocale);

dayjs.updateLocale("tr", {
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
    "Mai",
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
    "Mai",
    "Iýn",
    "Iýl",
    "Awg",
    "Sen",
    "Okt",
    "Noý",
    "Dek"
  ],
  weekStart: 1
});

dayjs.locale("tr");

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr" >
      <ToastContainer position="bottom-right" />
      <RouterProvider router={routes} />
    </LocalizationProvider>
  )
}

export default App;
