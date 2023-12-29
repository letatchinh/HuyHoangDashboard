import { useTranslation } from "react-i18next"

 const useTranslate = () => {
    const {t} : any  = useTranslation();
    return {t}
};

export default useTranslate;
