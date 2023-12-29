import  dashboardVi from '~/locales/vi';
import  dashboardEn from '~/locales/en';
// import  en from '~/locales/en';
declare module 'i18next' {

    const resources = {
        vi : {
            dashboardVi
        },
        en : {
            dashboardEn
        },
      } as const;
      
      export default resources;
  interface CustomTypeOptions {
    resources: typeof resources;
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next init options)
    // returnNull: false;
  }
}