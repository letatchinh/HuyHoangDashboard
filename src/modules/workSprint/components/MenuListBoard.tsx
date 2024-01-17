import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetWorkSprints } from '../workSprint.hook';
import { useFormTaskContext } from '~/modules/workList/screens/WorkList';

interface Sprint {
  _id: string;
  name: string;
}

function MenuListBoard() {
  const { boardId } = useFormTaskContext();
  const query = useMemo(() => {
    if (boardId) {
      return {
        page: 1,
        limit: 30,
        boardId,
      };
    }
    return null;
  }, [boardId]);
  // }, []);
  
  const [sprints] = useGetWorkSprints(query);
console.log(sprints)
  return (
    <div className="menu_list_board-container">
      {sprints &&
        sprints.map(({ _id, name }: Sprint) => (
          <div key={_id} className="menu_list_board_content">
            <Link className="menu_list_board_content_link" to={`/work-board/detail/${_id}`} replace>
              - {name}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default MenuListBoard;
