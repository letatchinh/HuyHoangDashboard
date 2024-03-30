import { get } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import BackBtn from "~/components/common/BackBtn";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetSupplier } from "~/modules/supplier/supplier.hook";
import { PATH_APP } from "~/routes/allPath";
import { useChangeDocumentTitle } from "~/utils/hook";
import ListProduct from "../components/ListProduct";
type propsType = {};
export default function Product(props: propsType): React.JSX.Element {
  const { supplierId } = useParams();

  const [supplier,isLoading] = useGetSupplier(supplierId);
  useChangeDocumentTitle("Danh sách mặt hàng của " + get(supplier,'name'),{dependency : [supplier]})
  return (
    <div>
      <BackBtn label={"Danh sách nhà cung cấp"} path={PATH_APP.supplier.root}/>
      {isLoading ? "Đang tải..." : <h4>Danh sách sản phẩm của {get(supplier,'name')}</h4>}
      <ListProduct supplierId={supplierId} />
    </div>
  );
}
