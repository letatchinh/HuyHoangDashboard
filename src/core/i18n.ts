import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import dashboardVi from '~/locales/vi';
import dashboardEn from '~/locales/en';
export const defaultNS = 'dashboard';
const language : string | null = localStorage.getItem("I18N_LANGUAGE");
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "vi")
}
i18next.use(initReactI18next).init({
  lng: language || 'vi', // default 'vi
  // debug: true,
  resources: {
    vi : {
      dashboard : dashboardVi
    },
    en : {
      dashboard : dashboardEn
    },
  },
  defaultNS
});