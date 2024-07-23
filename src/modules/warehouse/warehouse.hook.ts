import { get, head, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { warehouseActions } from "./redux/reducer";
import { DataTypeSelected, ItemProduct } from "./warehouse.modal";
import { ColumnsType } from "antd/es/table";
import { TableColumnsType } from "antd";
const MODULE = "warehouse";
const MODULE_VI = "kho";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useWarehousePaging = () => useSelector(pagingSelector);
const getSelector = (key: any) => (state: any) => state.warehouse[key];
const updateManagementWarehouseSuccessSelector = getSelector('updateManagementWarehouseSuccess');
const updateManagementWarehouseFailedSelector = getSelector('updateManagementWarehouseFailed'); 

const checkWarehouseSuccessSelector = getSelector('checkWarehouseSuccess');
const checkWarehouseFailedSelector = getSelector('checkWarehouseFailed'); 
const isCheckWarehouseSelector = getSelector('isCheckWarehouse'); 

const warehouseLinkedSuccessSelector = getSelector('warehouseLinked');
const warehouseLinkedFailedSelector = getSelector('getWarehouseLinkedFailed'); 

const warehouseDefaultSuccessSelector = getSelector('warehouseDefault');
const warehouseDefaultFailedSelector = getSelector('getWarehouseDefaultFailed'); 

const createBillToWarehouseSuccessSelector = getSelector('createBillToWarehouseSuccess');
const createBillToWarehouseFailedSelector = getSelector('createBillToWarehouseFailed'); 

const deleteWarehouseLinkedSuccessSelector = getSelector('deleteWarehouseLinkedSuccess');
const deleteWarehouseLinkedFailedSelector = getSelector('deleteWarehouseLinkedFailed');

const listInventorySuccessSelector = getSelector('listInventory');
const getInventoryFailedSelector = getSelector('getInventoryFailed'); 
const isLoadingInventorySelector = getSelector('isLoadingInventory'); 
const pagingInventorySelector = getSelector('listInventoryPaging');

const listInventoryCreateSuccessSelector = getSelector('listInventoryCreate');
const getInventoryCreateFailedSelector = getSelector('getInventoryCreateFailed'); 
const isLoadingInventoryCreateSelector = getSelector('isLoadingInventoryCreate'); 
const pagingInventoryCreateSelector = getSelector('listInventoryCreatePaging');
export const usePagingInventory = ()=> useSelector(pagingInventorySelector);
export const usePagingInventoryCreate = ()=> useSelector(pagingInventoryCreateSelector);

export const useGetWarehouses = () => {
  return useFetch({
    action: warehouseActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
  });
};
export const useGetWarehouse = (id?: any) => {
  const profile = useSelector((state: any) => state.auth.profile);
  return useFetchByParam({
    action: warehouseActions.getWarehouseDefaultRequest,
    loadingSelector: loadingSelector,
    dataSelector: warehouseDefaultSuccessSelector,
    failedSelector: warehouseDefaultFailedSelector,
    param: id ?? profile?.profile?.branchId,
  });
};
export const useGetWarehouseByBranchLinked = (id?: any) => {
  const profile = useSelector((state: any) => state.auth.profile);
  return useFetchByParam({
    action: warehouseActions.getWarehouseLinkedRequest,
    loadingSelector: loadingSelector,
    dataSelector: warehouseLinkedSuccessSelector,
    failedSelector: warehouseLinkedFailedSelector,
    param: id ?? profile?.profile?.branchId,
  });
};

export const useCreateWarehouse = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: warehouseActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCreateBillToWarehouse = (callback?: any) => {
  useSuccess(
    createBillToWarehouseSuccessSelector,
    `Tạo mới yêu cầu xuất hàng đến kho thành công`,
    callback
  );
  useFailed(createBillToWarehouseFailedSelector);

  return useSubmit({
    action: warehouseActions.createBillToWarehouseRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCheckWarehouse = (callback?: any) => {
  useSuccess(
    checkWarehouseSuccessSelector,
    useSelector(checkWarehouseSuccessSelector)?.message,
    callback
  );
  useFailed(checkWarehouseFailedSelector, (useSelector(checkWarehouseFailedSelector)?.message), callback);
  return useSubmit({
    action: warehouseActions.checkWarehouseRequest,
    loadingSelector: isCheckWarehouseSelector,
  });
};

export const useUpdateWarehouse = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: warehouseActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateManagementWarehouse = (callback?: any) => {
  useSuccess(
    updateManagementWarehouseSuccessSelector,
    `Cập nhật ${MODULE_VI} mặc định thành công`,
    callback
  );
  useFailed(updateManagementWarehouseFailedSelector);

  return useSubmit({
    action: warehouseActions.updateManagementWarehouseRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteWarehouse = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: warehouseActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteWarehouseLinked = (callback?: any) => {
  useSuccess(deleteWarehouseLinkedSuccessSelector, `Xoá liên kết kho thành công`, callback);
  useFailed(deleteWarehouseLinkedFailedSelector);

  return useSubmit({
    action: warehouseActions.deleteWarehouseLinkedRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useWarehouseQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateWarehouseParams = (
  query: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = (param: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(listOptionSearch, query, param);

    if (!param.page) {
      query.page = 1;
    }

    // Convert Query and Params to Search Url Param
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    // Navigate
    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};

export const convertDataByManagementArea = (data: any) => {
  return data.warehouses?.map((item: any) => {
    return {
      ...item,
      managementArea: item.managementArea.map((area: any) => ({
        path: area.value,
        fullAddress: area.label,
      })),
    };
  });
};

export const useResetAction = () => {
  return useResetState(warehouseActions.resetAction);
};
 
export const useInitWarehouse = (values: any) => {
 return ({warehouses:values?.map((item: any) => ({
    ...item,
    managementArea: item.managementArea.map((area: any) => ({
      value: area.path,
      label: area.fullAddress,
    })),
  }))})
};

export const convertProductsFromBill = (listBill: any) => {
  const newList: ItemProduct[] = (listBill || [])?.map((item: any) => ({
    name: get(item, 'product.name'),
    manufacturer: get(item, 'product.manufacturer.name'),
    unit: get(item, 'variant.unit.name'),
    quantity: get(item, 'quantity'),
    // category: get(item, 'product.category.name', 'product'),
    // productId: get(item, 'product._id', ''),
    // variantId: get(item, 'variant._id', ''),
    codeBySupplier: get(item, 'codeBySupplier', ''),
    notePharmacy: get(item, 'notePharmacy', ''),
  }));
  return newList
};

// NHỚ KHAI BÁO TYPES
export const convertDataSentToWarehouse = (data: any) => {
  const listProduct = data?.billItems?.map((item: any) => ({codeBySupplier: item?.codeBySupplier, quantity: item?.quantity}));
  const newValue = { 
    listProduct,
    warehouseId: data?.warehouseId,
    billId: data?._id,
    isCreateOrder: true,
    totalPrice: data?.totalPrice,
    deliveryAddress: data?.deliveryAddress,
    customerInfo: {
      name: data?.pharmacy?.name ?? data?.pharmacy?.fullName,
      phoneNumber: data?.pharmacy?.phoneNumber,
      email: data?.pharmacy?.email,
    },
    dataTransportUnit: {
      ...omit(data?.dataTransportUnit, ['height', 'length', 'width', 'weight']),
    },
    notePharmacy: data?.notePharmacy,
  };
  return newValue;
};


export function convertPathToObject(path: string) {
  const parts = path.split('/').filter(part => part); 
  return {
      areaId: parts[0],
      cityId: parts[1],
      districtId: parts[2],
      wardId: parts[3]
  };
};


interface itemManagementArea {
  path: string;
  fullAddress?: string;
  _id?: string;
};
interface warehouseManagementAreaItem {
  managementArea: itemManagementArea[];
  warehouseId: number;
  _id?: string;
};
export function findMatchingManagementArea(address: any, warehouseDefault: warehouseManagementAreaItem[]) {
  const convertWarehouseDefault = warehouseDefault?.map((item: any) => ({
    ...item,
    managementArea: item?.managementArea?.map((area: any) => ({
      ...area,
      ...convertPathToObject(area?.path),
    })),
  }));
  for (const warehouse of convertWarehouseDefault) {
    for (const area of warehouse.managementArea) {
      if (area.areaId === address.areaId) {
        if (area.cityId === undefined || area.cityId === address.cityId) {
          if (
            area.districtId === undefined ||
            area.districtId === address.districtId
          ) {
            if (
              area.wardId === undefined ||
              area.wardId === address.wardId
            ) {
              return warehouse;
            }
          }
        }
      }
    }
  }
  return null;
};

export const useGetInfoWarehouse = () => {
  const listWarehouse = useSelector((state: any) => state?.warehouse?.warehouseLinked);
  const getInfo = (id: string | undefined) => listWarehouse?.find((item: any) => item?._id === id);
  return [getInfo];
};

export const useGetListWarehouseReducer = () => useSelector((state: any) => state?.warehouse?.warehouseLinked);
    

export const useInventoryWarehouseQueryParams = (id?:number | null) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const warehouseId = id ?? query.get("warehouseId");
  const supplierId = query.get("supplierId");
  const startDate = query.get("startDate") || null;
  const endDate = query.get("endDate") || null;
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      warehouseId,
      startDate,
      endDate,
      supplierId
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword,warehouseId, startDate, endDate,supplierId]);
};

export const useUpdateInventoryWarehouseParams = (
  query: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = (param: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(listOptionSearch, query, param);

    if (!param.page) {
      query.page = 1;
    }

    // Convert Query and Params to Search Url Param
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    // Navigate
    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};


export const useGetInventory = (param?: any) => {
  return useFetchByParam({
    action: warehouseActions.getInventoryRequest,
    loadingSelector: isLoadingInventorySelector,
    dataSelector: listInventorySuccessSelector,
    failedSelector: getInventoryFailedSelector,
    param,
  });
};
export const useGetInventoryCreate = (param?: any) => {
  return useFetchByParam({
    action: warehouseActions.getInventoryInCreateRequest,
    loadingSelector: isLoadingInventoryCreateSelector,
    dataSelector: listInventoryCreateSuccessSelector,
    failedSelector: getInventoryCreateFailedSelector,
    param,
  });
};

export const useColumns = (props: any) => {
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã sản phẩm",
        dataIndex: "codeBySupplier",
        key: "codeBySupplier",
        width: 50,
        fixed: "left",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: 100,
      },
      {
        title: "Số lượng",
        dataIndex: "variant",
        key: "quantity",
        width: 40,
        render: (value: any) => value?.quantity,
      },
      {
        title: "Đơn vị",
        dataIndex: "variant",
        key: "unit",
        width: 50,
        render: (value: any) => value?.unit?.name,
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "supplierName",
        key: "supplierName",
        width: 50,
        render: (value: any) => value
      },
    ],
    [props]
  );
  return columns;
};
