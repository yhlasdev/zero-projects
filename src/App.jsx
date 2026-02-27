import './App.css'
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/tr";
import { Toaster } from 'react-hot-toast';

dayjs.extend(updateLocale);

dayjs.updateLocale("tr", {
  weekdays: [
    "Duşenbe",
    "Sişenbe",
    "Çarşenbe",
    "Penşenbe",
    "Anna",
    "Şenbe",
    "Yekşenbe"
  ],
  weekdaysShort: ["Du", "Şi", "Ça", "Pe", "An", "Şe", "Ye"],
  weekdaysMin: ["Du", "Şi", "Ça", "Pe", "An", "Şe", "Ye"],
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
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </LocalizationProvider>
  )
}

export default App;
