import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";
import type { TestModal } from "../test.modal.ts";
import { useGetTestList, useTestListQueryParams } from "../test.hook.ts";
import { Form, GetProps } from "antd";
const ContextWrapper = createContext({
  paging: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  dataSource: [] as TestModal[],
  dataSourceLoading: false,
});

const Container = (props: PropsWithChildren) => {
  const query = useTestListQueryParams();
  const [dataSource, dataSourceLoading] = useGetTestList(query);
  return (
    <ContextWrapper.Provider
      value={{
        paging: {
          current: 1,
          pageSize: 20,
          total: 0,
        },
        dataSource: dataSource ?? [],
        dataSourceLoading,
      }}
    >
      {props.children}
    </ContextWrapper.Provider>
  );
};
Container.Consumer = ContextWrapper.Consumer;

////////////////////////////////////////////////////////////////
const ContextDetail = createContext({
  id: "",
});

const Detail = (props: PropsWithChildren) => {
  return (
    <ContextDetail.Provider
      value={{
        id: "",
      }}
    >
      {props.children}
    </ContextDetail.Provider>
  );
};

Detail.Consumer = ContextDetail.Consumer;

////////////////////////////////////////////////////////////////
const ContextCreate = createContext({
  form: null as ReturnType<typeof Form.useForm>[0],
  getAssetKey: ''
});

const Create = (props: PropsWithChildren) => {
  const [ form ] = Form.useForm();
  const getAssetKey = useMemo(()=>{
    return form.getFieldValue('assetKey')

  },[form])
  return (
    <ContextCreate.Provider
      value={{
        form,
        getAssetKey,
      }}
    >
      {props.children}
    </ContextCreate.Provider>
  );
};

Create.Consumer = ContextCreate.Consumer;

export const Context = {
  Container,
  useContainer: () => useContext(ContextWrapper),

  Detail,
  useDetail: () => useContext(ContextDetail),

  Create,
  useCreate: () => useContext(ContextCreate),
};
