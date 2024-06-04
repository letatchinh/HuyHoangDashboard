import { createContext, useContext, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import ApiKeyForm from "../components/ApiKeyForm";
import { useDispatch } from "react-redux";
import { branchSliceAction } from "../redux/reducer";
import { useBranchPaging, useBranchQueryParams, useCreateBranch, useGetBranches, useUpdateApiKey, useUpdateBranchParams } from "../branch.hook";
import BranchForm from "../components/BranchForm";

interface BranchProps {
  children: React.ReactNode;
};
interface PropsApiKeyForm{
  branchId?: string | undefined;
};

export type BranchTypeContext = {
  openForm: (data?: any) => void;
  closeForm: () => void;
  paging: any;
  branches: any[];
  onParamChange: (param: any) => void | undefined;
  id: string | null | undefined;
  isSubmitLoading: boolean;
  openFormApiKey: (data?: PropsApiKeyForm) => void;
  isLoading: boolean;
  onCreateBranch: (p: any) => void;
};

const BranchContext = createContext<BranchTypeContext>({
  openForm: (data?: any) => {},
  closeForm: () => { },
  paging: {},
  branches: [],
  onParamChange: (param: any) => { },
  openFormApiKey: (data?: PropsApiKeyForm) => { },
  isSubmitLoading: false,
  isLoading: false,
  id: null,
  onCreateBranch: (p: any) => { }
});

export function BranchProviderContext({ children }: BranchProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenModalApiKey, setIsOpenModalApiKey] = useState(false);
  const [id, setId] = useState<string | null | undefined>(null);

  const [query] = useBranchQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateBranchParams(query);
  const [branches, isLoading] = useGetBranches(query);
  const paging = useBranchPaging(); 
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(branchSliceAction.resetAction());
  };
  const [, onCreateBranch] = useCreateBranch();

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

  const openFormApiKey = (data?: PropsApiKeyForm) => {
    setIsOpenModalApiKey(true);
    setId(data?.branchId);
  };
  const closeFormApiKey = () => {
    setIsOpenModalApiKey(false);
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
        onCreateBranch
      }}
    >
      {children}
      <ModalAnt
        width={700}
        onCancel={closeFormApiKey}
        open={isOpenModalApiKey}
        title="Mã liên kết kho"
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
    </BranchContext.Provider>
  );
};
const useBranchContext = (): BranchTypeContext => useContext(BranchContext);
export default useBranchContext;