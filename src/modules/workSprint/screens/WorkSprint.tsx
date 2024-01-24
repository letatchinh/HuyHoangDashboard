import React, { Suspense, createContext, lazy, memo, useCallback, useContext, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { clone } from 'lodash';
import NavBoard from '../components/NavBoard';
import SprintList from '../components/SprintList';
import { useGetlistWorkBoard } from '~/modules/workBoard/workBoard.hook';
import { useGetWorkSprints } from '../workSprint.hook';
// import './workSprint.style.scss';
const SprintPageProvider = createContext<{
  showDrawer?: (param?: boolean) => void;
  visibleListBoard?: boolean;
  board?: any[];
} | undefined>(undefined);

export const useSprintContext = () => useContext(SprintPageProvider) as {
  showDrawer: (param?: boolean) => void;
  visibleListBoard: boolean;
  board: any[];
};

const showDeeply = (result: any[], now: any) => {
  let clone_ = clone(now);
  result.push(clone_);
  if (clone_?.children) {
    clone_?.children.reduce(showDeeply, result);
  }
  return result;
};

const Sprint: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const query = useMemo(() => ({ page: 1, limit: 20 }), []);
  const [visibleListBoard, setVisibleListBoard] = useState(false);
  const showDrawer = useCallback((param?: boolean) => {
    setVisibleListBoard((val) => param ?? !val);
  }, []);

  const [board, isLoadingList] = useGetlistWorkBoard(query);
  const memoizedProps = useMemo(() => ({
    showDrawer,
    visibleListBoard,
    board: board.reduce(showDeeply, []),
  }), [showDrawer, visibleListBoard, board]);

  return (
    <div >
    <div className="sprint-page" style={{ height: '100vh', overflow: 'hidden' }}>
      <SprintPageProvider.Provider value={memoizedProps}>
      <NavBoard />
        <Suspense fallback={<div>...</div>}>
        </Suspense>
       <SwitchRouter path={pathname} />
      </SprintPageProvider.Provider>
    </div>
    </div>

  );
};

export default Sprint;

interface SwitchRouterProps {
  path: string;
}

const SwitchRouter: React.FC<SwitchRouterProps> = memo(({ path }) => {
  return (
    <SprintList />
    // <Routes>
    //   <Route
    //      path={`/work-board/sprint/:id`}
    //      element={
    //       <SprintList />
    //      }
    //   />
    // </Routes>
 );
});
