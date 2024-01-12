import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetWorkSprints } from '../workSprint.hook';

interface Sprint {
  _id: string;
  name: string;
}

function MenuListBoard() {
//   const { boardId } = useFormTaskContext();
  const query = useMemo(() => {
    // if (boardId) {
      return {
        page: 1,
        limit: 30,
        // boardId,
      };
    // }
    // return null;
//   }, [boardId]);
  }, []);

  const [sprints] = useGetWorkSprints(query);

  return (
    <div className="menu_list_board-container">
      {sprints &&
        sprints.map(({ _id, name }: Sprint) => (
          <div key={_id} className="menu_list_board_content">
            <Link className="menu_list_board_content_link" to={`/work-flow/detail/${_id}`} replace>
              - {name}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default MenuListBoard;
