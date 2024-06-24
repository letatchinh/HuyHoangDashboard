import { createContext, useContext, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import ApiKeyForm from "../components/ApiKeyForm";
import { useDispatch } from "react-redux";
import { branchSliceAction } from "../redux/reducer";
import { useBranchPaging, useBranchQueryParams, useCreateBranch, useGetBranches, useUpdateApiKey, useUpdateBranchParams } from "../branch.hook";
import BranchForm from "../components/BranchForm";
import { useDeleteWarehouseLinked } from "~/modules/warehouse/warehouse.hook";
import ListWarehouseLinked from "../components/ListWarehouseLinked";

interface BranchProps {
  children: React.ReactNode;
};

interface dataDeleteWarehouseLinked {
  id: string | null
  warehouseIds: string[]
};

export type BranchTypeContext = {
  openForm: (data?: any) => void;
  closeForm: () => void;
  paging: any;
  branches: any[];
  onParamChange: (param: any) => void | undefined;
  id: string | null ;
  isSubmitLoading: boolean;
  openFormApiKey: (id?: string | null) => void;
  isLoading: boolean;
  onCreateBranch: (p: any) => void;
  deleteWarehouseLink: (p: dataDeleteWarehouseLinked) => void;
  openFormDeleteWarehouseLinked: (id?: string | null) => void;
  closeFormDeleteWarehouseLinked: () => void;
};

const BranchContext = createContext<BranchTypeContext>({
  openForm: (data?: any) => {},
  closeForm: () => { },
  paging: {},
  branches: [],
  onParamChange: (param: any) => { },
  openFormApiKey: (id?: string | null ) => { },
  isSubmitLoading: false,
  isLoading: false,
  id: null,
  onCreateBranch: (p: any) => { },
  deleteWarehouseLink: (p: dataDeleteWarehouseLinked) => { },
  openFormDeleteWarehouseLinked: (id?: string | null) => { },
  closeFormDeleteWarehouseLinked: () => { }
});

export function BranchProviderContext({ children }: BranchProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenModalApiKey, setIsOpenModalApiKey] = useState(false);
  const [isOpenModalDeleteWarehouseLinked, setIsOpenModalDeleteWarehouseLinked] = useState(false);
  const [id, setId] = useState<any>(null);


  const [query] = useBranchQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateBranchParams(query);
  const [branches, isLoading] = useGetBranches(query);
  const paging = useBranchPaging(); 
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(branchSliceAction.resetAction());
  };
  const [, onCreateBranch] = useCreateBranch();
  const [, deleteWarehouseLink] = useDeleteWarehouseLinked(
    () => {
      closeFormApiKey();
      resetAction();
    }
  );
  const [isSubmitLoading, updateApiKey] = useUpdateApiKey(() => {
    closeFormApiKey();
    resetAction();
  });
  

  const openForm = (data?: any) => { 
    setIsOpenForm(true);
    setId(data?.id);
  };
  const closeForm = () => { 
    setIsOpenForm(false);
    setId(null);
  };

  const openFormApiKey = (id?: string | null ) => {
    setIsOpenModalApiKey(true);
    setId(id);
  };
  const closeFormApiKey = () => {
    setIsOpenModalApiKey(false);
    setId(null);
  };
  
  const openFormDeleteWarehouseLinked = (id?: string | null ) => {
    setIsOpenModalDeleteWarehouseLinked(true);
    setId(id);
  };
  const closeFormDeleteWarehouseLinked = () => {
    setIsOpenModalDeleteWarehouseLinked(false);
    setId(null);
  };
  return (
    <BranchContext.Provider
      value={{
        openForm,
        closeForm,
        paging,
        branches,
        onParamChange,
        id,
        isSubmitLoading,
        openFormApiKey,
        isLoading,
        onCreateBranch,
        deleteWarehouseLink,
        closeFormDeleteWarehouseLinked,
        openFormDeleteWarehouseLinked
      }}
    >
      {children}
      <ModalAnt
        width={700}
        onCancel={closeFormApiKey}
        open={isOpenModalApiKey}
        title="Cập nhật mã liên kết kho"
        footer={null}
        confirmLoading={isSubmitLoading}
        destroyOnClose
      >
        <ApiKeyForm id = {id} updateApiKey={updateApiKey}/>
      </ModalAnt>
      <ModalAnt
        width={1200}
        onCancel={closeForm}
        open={isOpenForm}
        title= {id ? "Cập nhật chi nhánh" : "Tạo chi nhánh"}
        footer={null}
        confirmLoading={isSubmitLoading}
      >
        <BranchForm id={id}/>
      </ModalAnt>
      <ModalAnt
        width={800}
        onCancel={closeFormDeleteWarehouseLinked}
        open={isOpenModalDeleteWarehouseLinked}
        title= {'Xoá liên kết kho'}
        footer={null}
        confirmLoading={isSubmitLoading}
      >
        <ListWarehouseLinked/>
      </ModalAnt>
    </BranchContext.Provider>
  );
};
const useBranchContext = (): BranchTypeContext => useContext(BranchContext);
export default useBranchContext;