import { get } from 'lodash';
import { createContext, useContext, useMemo } from 'react';
import { useGetProfile } from '~/modules/auth/auth.hook';
import { useGetListManagersByIdBoard, useGetListStaffsByIdBoard } from '~/modules/workBoard/workBoard.hook';
import { useGetHistoryActivityTaskById} from '~/modules/workTask/workTask.hook';
const ROLE = {
    manage: 'manage',
    member: 'member',
    default: 'default',
}

const ROLE_VI = {
    manage: 'Quản lý',
    member: 'Thành viên',
    default: 'Mặc định',

};
interface PropsContext {
    assign?: any;
    ROLE?: any;
    ROLE_VI?: any;
    allHistoryTaskById?: any;
    dataTask?: any;
    profile?: any;
};
const TaskItem = createContext<PropsContext>({
    assign: {},
    ROLE,
    ROLE_VI,
    allHistoryTaskById: [],
    dataTask: undefined,
});

export function TaskItemProvider({
    dataTask,
    children
}: any) {
    const profile = useGetProfile();
    // const isAdmin = useMatchPolicy(POLICIES.ADMIN_TODOLIST);
    const { _id, assignUser = [], boardId } = dataTask || {};

    const newQuery = useMemo(() => {
        if (!_id) return undefined;
        return {
            id: get(dataTask, '_id')
        }
    }, [_id]);
    
    const [managers, isLoadingManagers] = useGetListManagersByIdBoard(boardId);
    const [staffs, isLoadingStaffs] = useGetListStaffsByIdBoard(boardId);
    const [allHistoryTaskById,isLoadingHis] = useGetHistoryActivityTaskById(newQuery);
    const {users, isLoading, canAssign} = useMemo(() => {
        let mergeUsers : any = [];
        let canAssign = !!get(profile?.user, 'isSuperAdmin') || // is Super Admin
         managers?.some((item: any) => get(item, '_id') === get(profile?.user, '_id')) // Include Manager
          // isAdmin // have permission Administrator
        staffs?.forEach((item: any) => {
            mergeUsers.push({ ...item, role: ROLE.member });
        });

        managers?.forEach((item: any) => {
            mergeUsers.push({ ...item, role: ROLE.manage });
        });


        return {users:mergeUsers, isLoading : isLoadingStaffs, canAssign};
    }, [staffs, profile?.user, assignUser, managers]);
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
        >
            {children}
        </TaskItem.Provider>
    );
}

const useTaskItemStore = () => useContext(TaskItem);

export default useTaskItemStore;
