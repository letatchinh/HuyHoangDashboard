import { useResetState } from "~/utils/hook";
import { medicineSliceAction } from "./redux/reducer";

export const useResetAction = () => {
    return useResetState(medicineSliceAction.resetAction);
  };