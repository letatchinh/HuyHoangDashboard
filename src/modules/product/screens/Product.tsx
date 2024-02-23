import { get } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetSupplier } from "~/modules/supplier/supplier.hook";
import ListProduct from "../components/ListProduct";
type propsType = {};
export default function Product(props: propsType): React.JSX.Element {
  const { supplierId } = useParams();

  const [supplier,isLoading] = useGetSupplier(supplierId);
  return (
    <div>
      <Breadcrumb title={isLoading ? "Đang tải..." : <p>Danh sách sản phẩm của {get(supplier,'name')}</p>} />
      <ListProduct supplierId={supplierId} />
    </div>
  );
}
