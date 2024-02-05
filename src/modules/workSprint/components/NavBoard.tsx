import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Drawer, Tree } from 'antd';
import Text from 'antd/lib/typography/Text';
import { compact, pick } from 'lodash';
import { ResizableBox } from 'react-resizable';
import { useSprintContext } from '../screens/WorkSprint';
import { useGetlistWorkBoard } from '~/modules/workBoard/workBoard.hook';
// import { useGetAllBoard } from '~/hooks';
// import { useSprintContext } from './Sprint';

interface NavBoardProps {
  board?: any[];
  isLoadingList?: boolean;
}


  export default function NavBoard({board, isLoadingList}: NavBoardProps): React.JSX.Element {
  // const query = useMemo(() => ({ page: 1 }), []);
  const { showDrawer, visibleListBoard } = useSprintContext();
  // const [board, isLoadingList] = useGetlistWorkBoard(query);
  // console.log("board");
  const convertBoard = useMemo(() => {
    if (board?.length) {
      const func = (path = '') => function repeat(value:any) {
        let temp:any = pick(value, ['_id', 'children', 'name']);
        temp.key = String(temp._id);
        temp.title = (
          <Link to={`/work-board/sprint/${temp._id}`} style={{textDecoration: 'none'}}>
            <p style={{ fontSize: 16, color: 'black', width: '100%', margin: 0, padding: '4px 0' }}>
              {temp.name}
            </p>
          </Link>
        );
        temp.path = compact([path, String(temp._id)]).join('.');
        if (temp?.children) {
          temp.children = temp.children.map(func(temp.path));
        }
        return temp;
      };
      return board.map(func(''));
    }
    return [];
  }, [board]);
  return (
    <>
      <Drawer
        title={
          <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {' '}
            <Button type="dashed" href="/work-board">
              <ArrowLeftOutlined style={{ color: 'black', fontSize: 16 }} />
            </Button>{' '}
            Không gian làm việc{' '}
          </p>
        }
        placement="right"
        mask={true}
        maskStyle={{ background: 'transparent', width: '100vw' }}
        drawerStyle={{ background: '#dbe7ed' }}
        // width={'max-content'}
        closable={false}
        maskClosable={true}
        // onClose={() => showDrawer(false)}
        open={visibleListBoard}
        getContainer={false}
        headerStyle={{
          padding: '10px 8px 10px 0px',
        }}
        extra={
          <Button type="text" onClick={() => showDrawer(false)}>
            <CloseOutlined />
          </Button>
        }
        style={{
          position: 'absolute',
          boxShadow: '0px 3px 3px #333',
        }}
      >
        <div>
        </div>
        <ResizableBox
          className={'react-resizable_custom active'}
          resizeHandles={['e']}
          minConstraints={[280, Infinity]}
          maxConstraints={[400, Infinity]}
          height={Infinity}
          width={350}
        >
          <div className="nav-board">
            {!!convertBoard.length && (
              <Tree
                showLine={{
                  showLeafIcon: false,
                }}
                autoExpandParent={true}
                switcherIcon={<DownOutlined />}
                defaultExpandAll
                treeData={convertBoard}
                // showLeafIcon={false}
                blockNode={true}
                style={{
                  background: 'transparent',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>
        </ResizableBox>
      </Drawer>
    </>
  );
}
