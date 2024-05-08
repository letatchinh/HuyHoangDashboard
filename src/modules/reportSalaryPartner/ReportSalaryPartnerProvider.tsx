import { createContext, ReactNode, useContext, useMemo } from "react";
import { useFetchState } from "~/utils/helpers";
import apis from "./reportSalaryPartner.api";
import { REF_COLLECTION } from "~/constants/defaultValue";
import { METHOD_TYPE } from "../vouchers/constants";
export type GlobalReportSalaryPartner = {
  canRead: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canAdmin: boolean;
};
const ReportSalaryPartner = createContext<GlobalReportSalaryPartner>({
  canRead: false,
  canAdd: false,
  canUpdate: false,
  canDelete: false,
  canDownload: false,
  canAdmin: false,
});

type ReportSalaryPartnerProviderProps = {
  children: ReactNode;
  refCollection: keyof typeof REF_COLLECTION;
  methodType?: keyof typeof METHOD_TYPE | null;
  //   target: "employee" | "partner";
};

export function ReportSalaryPartnerProvider({
  children,
  refCollection,
  methodType
}: //   target,
ReportSalaryPartnerProviderProps): JSX.Element {
  const query = useMemo(() => ({ refCollection, methodType }), [refCollection, methodType]);
  const [
    { canRead, canAdd, canUpdate, canDelete, canDownload, canAdmin },
    loading,
  ] = useFetchState({
    api: apis.getAccessVoucher,
    query,
    useDocs: false,
    shouldRun : !!refCollection
  });

  return (
    <ReportSalaryPartner.Provider
      value={{
        canRead,
        canAdd,
        canUpdate,
        canDelete,
        canDownload,
        canAdmin,
      }}
    >
      {children}
    </ReportSalaryPartner.Provider>
  );
}

const useReportSalaryPartnerStore = (): GlobalReportSalaryPartner =>
  useContext(ReportSalaryPartner);

export default useReportSalaryPartnerStore;
