import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { useFetchState } from "~/utils/helpers";
import apis from "../../product.api";
import { useConvertDataAssignProductsCol } from "../../product.hook";
import { Modal } from "antd";
import ProductBorrowForm from "./ProductBorrowForm";

export type UseProductBorrowContext = {
  selectedRowKeys: any[];
  setSelectedRowKeys: any;
  setDataSelected: any;
  dataSelected: any;
  setSupplierId: any;
  supplierId: any;
  keyword?: string;
  setKeyword?: any;
  productOfCollaborator?: any;
  isLoadingProducts?: boolean;
  products?: any[];
};

const ProductBorrowContext = createContext<UseProductBorrowContext>({
  selectedRowKeys: [],
  setSelectedRowKeys: () => { },
  dataSelected: [],
  setDataSelected: () => { },
  setSupplierId: () => { },
  supplierId: [],
  setKeyword: () => { },
  keyword: "",
  productOfCollaborator: [],
  isLoadingProducts: false,
  products: [],
});
interface propsType {
  children?: ReactNode;
}
export default function ProductBorrowContextProvider({children}: propsType) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [dataSelected, setDataSelected] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const newQuery = useMemo(
    () => ({
      page: 1,
      limit: 200,
      isSupplierMaster: true,
      supplierId: supplierId,
      keyword,
    }),
    [keyword, supplierId]
  );
  const [products, isLoadingProducts] = useFetchState({
    api: apis.getAll,
    useDocs: true,
    query: newQuery,
  });
  const productOfCollaborator = useConvertDataAssignProductsCol(products?.docs,selectedRowKeys);


  return (
      <ProductBorrowContext.Provider value={{
        selectedRowKeys,
        setSelectedRowKeys,
        dataSelected,
        setDataSelected,
        supplierId,
        setSupplierId,
        keyword,
        setKeyword,
        productOfCollaborator,
        isLoadingProducts,
        products
      }}>
        {children}
      </ProductBorrowContext.Provider>
   )
};
const useProductBorrowContext = (): UseProductBorrowContext => useContext(ProductBorrowContext);
export { useProductBorrowContext };