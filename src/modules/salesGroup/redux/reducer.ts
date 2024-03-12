import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
function getMember(listMember: any[]): string {
  let memberName = "";
  listMember?.forEach((mem: any) => {
    memberName += " " + get(mem, "employee.fullName", "");
  });
  return memberName;
}
function getDataFromChild(
  children: any[],
  nameChild: string,
  memberChild: string
) {
  if (children?.length) {
    children.forEach((child: any) => {
      // get Data From Child
      nameChild = nameChild + " " + get(child, "name") + " " + get(child, "alias");
      memberChild = getMember(get(child, "salesGroupPermission", [])); // Get memberChild Child
      /////

      // Replay Function if Child Exist
      if (child?.children?.length) {
        getDataFromChild(child.children, nameChild, memberChild); // Pass Next Child to the function
      }
    });
  }
}
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  listTeamLead?: any;
  isLoadingGetListTeamLead?: boolean;
  getListTeamLeadFailed?: any;
  listMember?: any;
  isLoadingGetListMember?: boolean;
  getListMemberFailed?: any;
}
class SalesGroupClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("salesGroup");
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: any) => {
        try {
          state.isLoading = false;
          state.list = payload?.map((item: any) => {
            let nameChild = get(item, "name", "") + " " + get(item, "alias", ""); // Get Name And Alias Parent
            let memberChild: string = getMember(  get(item, "salesGroupPermission", [])); // Get memberChild Parent

            getDataFromChild(
              get(item, "children", []),
              nameChild, // Get Name And Alias From Child
              memberChild, // Get Member Child
            ); // Call Current Children
            return {
              ...item,
              nameChild,
              memberChild,
            };
          });
        } catch (error) {
          console.log(error);
        }
      },
      // Get List TeamLead
      getListTeamLeadRequest: (state: cloneInitState) => {
        state.isLoadingGetListTeamLead = true;
        state.getListTeamLeadFailed = null;
      },
      getListTeamLeadSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetListTeamLead = false;
        state.listTeamLead = payload;
      },
      getListTeamLeadFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isLoadingGetListTeamLead = false;
        state.getListTeamLeadFailed = payload;
      },

      // Get List Member
      getListMemberRequest: (state: cloneInitState) => {
        state.isLoadingGetListMember = true;
        state.getListMemberFailed = null;
      },
      getListMemberSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetListMember = false;
        state.listMember = payload;
      },
      getListMemberFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isLoadingGetListMember = false;
        state.getListMemberFailed = payload;
      },

      // Want Add more reducer Here...
    };
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSlice = new SalesGroupClassExtend();
const data = newSlice.createSlice();

export const salesGroupActions = data.actions;
export default data.reducer;
