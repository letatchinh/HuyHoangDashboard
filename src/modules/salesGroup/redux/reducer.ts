import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { convertDataTreeBuyGroup, RulesLeader } from "../salesGroup.service";
const RulesLeaderMethod = new RulesLeader();
function getMember(listMember: any[]): string {
  let memberName = "";
  listMember?.forEach((mem: any) => {
    memberName += " " + get(mem, "employee.fullName", "");
  });
  return memberName;
}

// const colorLevel : any = {
//   1 : SALES_GROUP_GEOGRAPHY_COLOR.AREA,
//   2 : SALES_GROUP_GEOGRAPHY_COLOR.REGION,
//   3 : SALES_GROUP_GEOGRAPHY_COLOR.GROUP,
//   4 : SALES_GROUP_GEOGRAPHY_COLOR.ZONE,
//   5 : 'black',
// };

const colorLevel: any = {
  1: "orange",
  2: "#91caff", // blue
  3: "#d3adf7", // Purple
  4: "#87d068",
  5: "black",
};

function getDataFromDeeplyChild(
  children: any[],
  nameChild: string,
  memberChild: string,
  groupHaveLeader: any[]
) {
  if (children?.length) {
    children.forEach((child: any) => {
      // get Data From Child
      nameChild =
        nameChild + " " + get(child, "name") + " " + get(child, "alias");
      memberChild = getMember(get(child, "salesGroupPermission", [])); // Get memberChild Child

      // Get Group Have Leader
      const leader = RulesLeaderMethod.FindOne(
        get(child, "salesGroupPermission", [])
      );
      // if (leader) {
      if (true) {
        groupHaveLeader.push(child);
      }
      /////

      // Replay Function if Child Exist
      if (child?.children?.length) {
        getDataFromDeeplyChild(
          child.children,
          nameChild,
          memberChild,
          groupHaveLeader
        ); // Pass Next Child to the function
      }
    });
  }
}

export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setDataForDeeplyChild(children: any[], levelOfColor: any,key : any) {
  if (children?.length) {
    return children.map((child: any,index :number) => {
      // Replay Function if Child Exist
      let childReturn: any;

      if (child?.children?.length) {
        childReturn = setDataForDeeplyChild(child.children, levelOfColor + 1,key + '-' + index); // Pass Next Child to the function
      }

      // set Data From Child
      return {
        ...child,
        color: colorLevel?.[levelOfColor] ?? getRandomColor(), // Set Color For Child
        children: childReturn,
        key : key + '-' + index
      };
      /////
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
  groupHaveLeader?: any;

  getListBuyGroupFailed?: any;
  listBuyGroup?: any;
}
class SalesGroupClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("salesGroup");
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state: cloneInitState, { payload }: any) => {
        try {
          let groupHaveLeader: any[] = [];
          state.isLoading = false;
          state.list = payload?.map((item: any, index: any) => {
            let nameChild =
              get(item, "name", "") + " " + get(item, "alias", ""); // Get Name And Alias Parent
            let memberChild: string = getMember(
              get(item, "salesGroupPermission", [])
            ); // Get memberChild Parent

            // Get Group Have Leader
            const leader = RulesLeaderMethod.FindOne(
              get(item, "salesGroupPermission", [])
            );
            if (true) {
              groupHaveLeader.push(item);
            }
            getDataFromDeeplyChild(
              get(item, "children", []),
              nameChild, // Get Name And Alias From Child
              memberChild, // Get Member Child
              groupHaveLeader // Get Group haveLeader
            ); // Call Current Children

            const children = setDataForDeeplyChild(
              get(item, "children", []),
              2,
              index
            );

            return {
              ...item,
              nameChild,
              memberChild,
              indexRow: index + 1, // 0 Falsy is False
              children,
              color: "orange",
              key : index
            };
          });
          state.groupHaveLeader = groupHaveLeader;
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
      // Get List Buy Group
      getListBuyGroupRequest: (state:cloneInitState) => {
        state.isLoading = true;
        state.getListBuyGroupFailed = null;
      },
      getListBuyGroupSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoading = false;
        state.listBuyGroup = convertDataTreeBuyGroup(payload?.docs);
      },
      getListBuyGroupFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isLoading = false;
        state.getListBuyGroupFailed = payload;
        
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
