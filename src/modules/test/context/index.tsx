import { createContext, PropsWithChildren, useContext } from "react";
import type { TestModal } from '../test.modal.ts';
import { useGetTestList, useTestListQueryParams } from "../test.hook.ts";
const ContextWrapper = createContext({
  paging:{
    current: 1,
    pageSize: 20,
    total: 0
  },
  dataSource: [] as TestModal[],
  dataSourceLoading: false
});

const Container = (props: PropsWithChildren) => {
  const query = useTestListQueryParams()
  const [ dataSource, dataSourceLoading ]= useGetTestList(query)
  return (
    <ContextWrapper.Provider value={{
      paging:{
        current: 1,
        pageSize: 20,
        total:0
      },
      dataSource: dataSource??[],
      dataSourceLoading
    }}>
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

Detail.Consumer = ContextDetail.Consumer



export const Context = {
  Container,
  useContainer :()=>useContext(ContextWrapper),
  
  Detail,
  useDetail :()=>useContext(ContextDetail),
};
