import { createContext, useContext } from "react";
import { STATUS_REQUEST_GROUP } from "./constants";
import data from "./data.json";
import { RequestGroupSubmitType } from "./requestGroup.modal";

  export type GlobalRequestGroup = {
    onChangeStatus : (p:{_id :any,status : keyof typeof STATUS_REQUEST_GROUP}) => void;
    data : RequestGroupSubmitType[] | any,
  };
  const RequestGroup = createContext<GlobalRequestGroup>({
    onChangeStatus : () => {},
    data : [],
  });
  
  type RequestGroupProviderProps = {
    children: any;
    
  };

  
  export function RequestGroupProvider({
    children
  }: RequestGroupProviderProps): JSX.Element {
    const onChangeStatus = () => {};
    
    return (
      <RequestGroup.Provider
        value={{
            onChangeStatus,
            data,
        }}
      >
        {children}
      </RequestGroup.Provider>
    );
  }
  
  const useRequestGroupStore = (): GlobalRequestGroup => useContext(RequestGroup);
  
  export default useRequestGroupStore;
  