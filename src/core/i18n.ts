import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import dashboardVi from '~/locales/vi';
import dashboardEn from '~/locales/en';
export const defaultNS = 'dashboard';
const language : string = localStorage.getItem("I18N_LANGUAGE") || 'vi'
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "vi")
}
i18next.use(initReactI18next).init({
  lng: language, // if you're using a language detector, do not define the lng option
  debug: true,
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