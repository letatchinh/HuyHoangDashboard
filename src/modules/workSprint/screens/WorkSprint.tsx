import React, { Suspense, createContext, lazy, memo, useCallback, useContext, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useMatch, useMatches, useNavigate } from 'react-router-dom';
import { clone } from 'lodash';
import NavBoard from '../components/NavBoard';
import SprintList from '../components/SprintList';
import { useGetlistWorkBoard } from '~/modules/workBoard/workBoard.hook';

// const NavBoard = lazy(() => import('./NavBoard.js'))
const SprintPageProvider = createContext<{
  showDrawer: (param?: boolean) => void;
  visibleListBoard: boolean;
  board: any[];
} | undefined>(undefined);

/**
 * Custom hook that returns the value of the SprintPageProvider context.
 *
 * @returns {{
 * showDrawer:function,
 * visibleListBoard:boolean,
 * board:Array,
 * }} The value of the SprintPageProvider context.
 */
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
}

const Sprint: React.FC = () => {
//   const  {pathname}  = useMatches();
  const location = useLocation();
  const {pathname} = location;
  const navigate = useNavigate();
  const query = useMemo(() => ({ page: 1, limit: 20 }), [])
  const [visibleListBoard, setVisibleListBoard] = useState(false)
  const showDrawer = useCallback((param?: boolean) => {
    setVisibleListBoard((val) => param ?? (!val));
  }, []);
  const [board, isLoadingList] = useGetlistWorkBoard(query);
  const memoizedProps = useMemo(() => ({
    showDrawer,
    visibleListBoard,
    board: board.reduce(showDeeply, [])
  }), [showDrawer, visibleListBoard, board]);

  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      <div className="sprint-page">
        <SprintPageProvider.Provider value={memoizedProps}>
          <Suspense fallback={<div>...</div>}>
            <NavBoard />
          </Suspense>
          <Routes>
            <Route path={pathname} element={<SwitchRouter />} />
          </Routes>
        </SprintPageProvider.Provider>
      </div>
    </div>
  );
}

export default Sprint;

// const SprintList = lazy(() => import('./SprintList.js'))

const SwitchRouter: React.FC = memo(() => {
  return (
    <Routes>
      <Route path=":boardId" key="boardId" element={<Suspense fallback={<div>...</div>}><SprintList /></Suspense>} />
    </Routes>
  );
});
