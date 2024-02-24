import React from "react";
import OrderSupplierModule from "~/modules/sale/orderSupplier";
type propsType = {};
export default function UpdateOrderSupplier(
  props: propsType
): React.JSX.Element {
  return (
    <OrderSupplierModule.storeProvider.UpdateOrderSupplier>
      <OrderSupplierModule.page.update />
    </OrderSupplierModule.storeProvider.UpdateOrderSupplier>
  );
}
