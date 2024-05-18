import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import VoucherModule from "~/modules/vouchers";
import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import { get, omit, sumBy } from "lodash";
import { useGetOrderSupplier } from "../orderSupplier.hook";
import { STATUS_BILL } from "../../bill/constants";

export type GlobalUpdateOrderSupplier = {
  orderSupplier: any;
  isLoading: boolean;
  mutateOrderSupplier: () => void;
  onOpenForm: () => void;
  totalMoneyPaymentVouchers?: number;
};
const UpdateOrderSupplier = createContext<GlobalUpdateOrderSupplier>({
  orderSupplier: null,
  isLoading: false,
  mutateOrderSupplier: () => {},
  onOpenForm: () => { },
  totalMoneyPaymentVouchers: 0
});

type UpdateOrderSupplierProviderProps = {
  children: ReactNode;
};

export function UpdateOrderSupplierProvider({
  children,
}: UpdateOrderSupplierProviderProps): JSX.Element {
  const { id } = useParams();
  const [reFetch, setReFetch] = useState(false);
  const mutateOrderSupplier = useCallback(() => setReFetch(!reFetch), [reFetch]);
  const [orderSupplier, isLoading] = useGetOrderSupplier(id, reFetch);
  const {
    pharmacyId,
    totalPrice,
    codeSequence,
    _id,
    totalReceiptVoucherCompleted,
    listPayment,
  } = orderSupplier || {};

  const totalMoneyPaymentVouchers = useMemo(() => {
    if (listPayment?.length > 0) {
      const data = listPayment?.filter((item: any)=> item?.status !== STATUS_BILL.CANCELLED);
      return sumBy([...data], (item) => get(item, 'totalAmount', 0));
    };
  }, [orderSupplier]);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const onOpenForm = () => {
    setIsOpenForm(true);
  };

  const onCloseForm = () => {
    setIsOpenForm(false);
  };

  return (
    <UpdateOrderSupplier.Provider
      value={{
        orderSupplier,
        isLoading,
        mutateOrderSupplier,
        onOpenForm,
        totalMoneyPaymentVouchers
      }}
    >
      {children}
      <ModalAnt
        title="Phiếu chi"
        open={isOpenForm}
        onCancel={onCloseForm}
        width={"auto"}
        footer={null}
        destroyOnClose
      >
        <VoucherModule.components.VoucherForm
          callback={mutateOrderSupplier}
          onClose={() => onCloseForm()}
          pharmacyId={pharmacyId}
          refCollection={REF_COLLECTION_UPPER["SUPPLIER"]}
          totalAmount={totalPrice - totalReceiptVoucherCompleted}
          reason={`Thu tiền đơn hàng ${codeSequence || ""} `}
          from="Pharmacy"
          provider={pharmacyId}
          max={totalPrice - totalReceiptVoucherCompleted}
          method={{
            data: omit(orderSupplier, [
              "orderSupplier",
              "orderItems",
              "historyStatus",
            ]),
            type: "ORDER",
          }}
          
        />
      </ModalAnt>
    </UpdateOrderSupplier.Provider>
  );
}

const useUpdateOrderSupplierStore = (): GlobalUpdateOrderSupplier =>
  useContext(UpdateOrderSupplier);

export default useUpdateOrderSupplierStore;
