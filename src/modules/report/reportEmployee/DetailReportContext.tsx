import { get } from "lodash";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import data from "./components/DetailReport/data.json";
import Swap from "./components/DetailReport/Swap";
import { DataSwapType, EmployeeType, ExchangeRateType, TargetsSupplierItem } from "./reportEmployee.modal";
import {
  handleConvertDataSourceDetailSalary,
  ItemDataSource,
} from "./reportEmployee.service";
type DataInitSwap = Pick<DataSwapType, 'resourceSupplierId' | 'targetSupplierId' | 'type'>

export type GlobalDetailReport = {
  onOpenSwap: (p?: DataInitSwap) => void;
  dataSourceTargetsTeam: TargetsSupplierItem[];
  dataSourceTargetsSelf: TargetsSupplierItem[];
  exchangeRateOverrideTargetsTeam: ExchangeRateType[];
  exchangeRateOverrideTargetsSelf: ExchangeRateType[];
  dataSourceDetailSalary: ItemDataSource[];
  employeeLevel: string;
  dataSwap? : DataInitSwap | null
};

const DetailReport = createContext<GlobalDetailReport>({
  onOpenSwap: () => {},
  dataSourceTargetsTeam: [],
  dataSourceTargetsSelf: [],
  exchangeRateOverrideTargetsTeam: [],
  exchangeRateOverrideTargetsSelf: [],
  dataSourceDetailSalary: [],
  employeeLevel: '',
  dataSwap : null
});

export function DetailReportProvider({
  children,
}: {
  children: any;
}): React.JSX.Element {
  const [openSwap, setOpenSwap] = useState(false);
  const [dataSwap, setDataSwap] = useState<DataInitSwap | null>();

  const onOpenSwap = useCallback((data?: DataInitSwap) => {
    if (data) {
      setDataSwap(data);
    }
    setOpenSwap(true);
  }, []);
  const onCloseSwap = useCallback(() => {
    setOpenSwap(false);
    setDataSwap(null)
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
        daysWorking: get(data, "daysWorking"),
        detailSalary: get(data, "detailSalary"),
        totalSalary: get(data, "salary.totalSalary"),
        bonus: get(data, "salary.totalBonus"),
        benefit: get(data, "salary.benefit"),
      }),
    [data]
  );
  const employeeLevel : string = useMemo(
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
      }}
    >
      {children}
      <ModalAnt width={800} destroyOnClose title="Quy đổi" footer={null} onCancel={onCloseSwap} open={openSwap}>
        <Swap />
      </ModalAnt>
    </DetailReport.Provider>
  );
}

const useDetailReportStore = (): GlobalDetailReport => useContext(DetailReport);

export default useDetailReportStore;
