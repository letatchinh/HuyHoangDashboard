import { get } from 'lodash';
import { createContext, useContext, useMemo } from 'react';
import { useGetHistoryActivityTaskById, useGetListManagersByIdBoard, useGetListStaffsByIdBoard, useMatchPolicy, useProfile } from '~/modules/workTask/workTask.hook';
const ROLE = {
    manage: 'manage',
    member: 'member',
    default: 'default',
}

const ROLE_VI = {
    manage: 'Quản lý',
    member: 'Thành viên',
    default: 'Mặc định',

}
const TaskItem = createContext({
    assign: {},
    ROLE,
    ROLE_VI
});

export function TaskItemProvider({
    dataTask,
    children
}: any) {
    const [profile] = useProfile();
    // const isAdmin = useMatchPolicy(POLICIES.ADMIN_TODOLIST);
    const { _id, assignUser = [], boardId } = dataTask || {};

    const newQuery = useMemo(() => {
        if(!_id) return undefined;
        return {
          id:get(dataTask,'_id')
        }
      },[_id])
    const [managers, isLoadingManagers] = useGetListManagersByIdBoard(boardId);
    const [staffs, isLoadingStaffs] = useGetListStaffsByIdBoard(boardId);
    const [allHistoryTaskById,isLoadingHis] = useGetHistoryActivityTaskById(newQuery);
    const {users, isLoading, canAssign} = useMemo(() => {
        let mergeUsers : any = [];
        let canAssign = !!get(profile, 'isSuperAdmin') || // is Super Admin
         managers?.some((item: any) => get(item, '_id') === get(profile, '_id')) // Include Manager
          // isAdmin // have permission Administrator
        staffs?.forEach((item: any) => {
            mergeUsers.push({ ...item, role: ROLE.member });
        });

        managers?.forEach((item: any) => {
            mergeUsers.push({ ...item, role: ROLE.manage });
        });


        return {users:mergeUsers, isLoading : isLoadingStaffs, canAssign};
    }, [staffs,profile,assignUser,managers]);
    return (
        <TaskItem.Provider
            value={{
                assign: {users, isLoading, canAssign,staffs,managers},
                ROLE,
                ROLE_VI,
                allHistoryTaskById,
                dataTask,
                profile,
            }}
            
            // allHistoryTaskById={allHistoryTaskById}
        >
            {children}
        </TaskItem.Provider>
    );
}

const useTaskItemStore = () => useContext(TaskItem);

export default useTaskItemStore;
