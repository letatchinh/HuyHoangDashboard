import { get } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { EMPLOYEE_LEVEL } from "~/modules/employee/constants";
import { EmployeeLevelType } from "~/modules/employee/employee.modal";
import Swap from "./components/DetailReport/Swap";
import {
  useGetReportEmployee,
  useUpdatePreviewReportEmployee,
} from "./reportEmployee.hook";
import {
  DataSwapType,
  ExchangeRateType,
  ReportEmployeeType,
  TargetsSupplierItem,
} from "./reportEmployee.modal";
import {
  handleConvertDataSourceDetailSalary,
  ItemDataSource,
} from "./reportEmployee.service";
type DataInitSwap = Pick<
  DataSwapType,
  "resourceSupplierId" | "targetSupplierId" | "type"
>;

export type GlobalDetailReport = {
  onOpenSwap: (p?: DataInitSwap) => void;
  dataSourceTargetsTeam: TargetsSupplierItem[];
  dataSourceTargetsSelf: TargetsSupplierItem[];
  exchangeRateOverrideTargetsTeam: ExchangeRateType[];
  exchangeRateOverrideTargetsSelf: ExchangeRateType[];
  dataSourceDetailSalary: ItemDataSource[];
  employeeLevel: string;
  dataSwap?: DataInitSwap | null;
  data?: ReportEmployeeType | null;
  loading: boolean;
  id?: any;
  onCancel: () => void;
  isSubmitLoadingPreview: boolean;
  onPreviewUpdate: (p?: any) => void;
};

const DetailReport = createContext<GlobalDetailReport>({
  onOpenSwap: () => {},
  onCancel: () => {},
  dataSourceTargetsTeam: [],
  dataSourceTargetsSelf: [],
  exchangeRateOverrideTargetsTeam: [],
  exchangeRateOverrideTargetsSelf: [],
  dataSourceDetailSalary: [],
  employeeLevel: "",
  dataSwap: null,
  data: null,
  id: null,
  loading: false,
  isSubmitLoadingPreview: false,
  onPreviewUpdate: () => {},
});

export function DetailReportProvider({
  children,
  id,
  onCancel,
}: {
  children: any;
  id?: string;
  onCancel: () => void;
}): React.JSX.Element {
  const [openSwap, setOpenSwap] = useState(false);
  const [dataSwap, setDataSwap] = useState<DataInitSwap | null>();
  const [data, isLoading] = useGetReportEmployee(id);
  const [isSubmitLoadingPreview, onPreviewUpdate] =
    useUpdatePreviewReportEmployee();

  const onOpenSwap = useCallback((dataSwap?: DataInitSwap) => {
    if (dataSwap) {
      setDataSwap(dataSwap);
    }
    setOpenSwap(true);
  }, []);
  const onCloseSwap = useCallback(() => {
    setOpenSwap(false);
    setDataSwap(null);
  }, []);
  const dataSourceTargetsTeam: TargetsSupplierItem[] = useMemo(
    () => get(data, "targetsTeam.targetSupplier", []),
    [data]
  );
  const dataSourceTargetsSelf: TargetsSupplierItem[] = useMemo(
    () => get(data, "targetsSelf.targetSupplier", []),
    [data]
  );
  const exchangeRateOverrideTargetsTeam: ExchangeRateType[] = useMemo(
    () => get(data, "targetsTeam.exchangeRateOverride", []),
    [data]
  );
  const exchangeRateOverrideTargetsSelf: ExchangeRateType[] = useMemo(
    () => get(data, "targetsSelf.exchangeRateOverride", []),
    [data]
  );
  const dataSourceDetailSalary: ItemDataSource[] = useMemo(
    () =>
      handleConvertDataSourceDetailSalary({
        baseSalary: get(data, "salary.base", 0),
        daysWorking: get(data, "daysWorkingInfo.daysWorking", 0),
        detailSalary: get(data, "detailSalary"),
        totalSalary: get(data, "salary.totalSalary", 0),
        bonus: get(data, "salary.totalBonus", 0),
        benefit: get(data, "salary.benefit", 0),
        salary: get(data, "salary"),
        _id : id,
        bonusOther : get(data,'bonusOther',[]),
        totalBonusOther : get(data,'totalBonusOther',0),
        employeeId : get(data,'employee.employeeId',"")
      }),
    [data]
  );
  const employeeLevel: EmployeeLevelType = useMemo(
    () => get(data, "employee.employeeLevel"),
    [data]
  );

  return (
    <DetailReport.Provider
      value={{
        onOpenSwap,
        dataSourceTargetsTeam,
        dataSourceTargetsSelf,
        dataSourceDetailSalary,
        employeeLevel,
        dataSwap,
        exchangeRateOverrideTargetsTeam,
        exchangeRateOverrideTargetsSelf,
        data,
        id,
        onCancel,
        loading: isLoading,
        isSubmitLoadingPreview,
        onPreviewUpdate,
      }}
    >
      {children}
      <ModalAnt
        width={800}
        destroyOnClose
        title="Quy đổi"
        footer={null}
        onCancel={onCloseSwap}
        open={openSwap}
      >
        <Swap onCloseSwap={onCloseSwap} />
      </ModalAnt>
    </DetailReport.Provider>
  );
}

const useDetailReportStore = (): GlobalDetailReport => useContext(DetailReport);

export default useDetailReportStore;
