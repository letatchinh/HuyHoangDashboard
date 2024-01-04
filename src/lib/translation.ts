import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
interface TranslateHook {
  t: TFunction;
}

const useTranslate = (): TranslateHook => {
  const { t }: TranslateHook = useTranslation();
  return { t };
};

export default useTranslate;
