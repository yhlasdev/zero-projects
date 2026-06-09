import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';

import ru from '../locales/ru.json';
import tk from '../locales/tk.json';
import en from '../locales/en.json';

const initialLanguage = localStorage.getItem("language") || "tk";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: { translation: ru },
            tk: { translation: tk },
            en: { translation: en },
        },
        lng: initialLanguage,
        fallbackLng: 'tk',
        interpolation: {
            escapeValue: false,
        },
    });

dayjs.locale(initialLanguage);

i18n.on('languageChanged', (lng) => {
    dayjs.locale(lng);
});

export default i18n;

