import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CommentTask from './CommentTask';
import { Avatar, Button, Space, Tooltip } from 'antd';
import { get, includes, isNil, sortBy } from 'lodash';
import Text from 'antd/lib/typography/Text';
import moment from 'moment';
import {
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined
} from '@ant-design/icons';
import useTaskItemStore from '~/store/TaskItemContext';
import { useProfile } from '~/modules/auth/auth.hook';
import { getShortName } from './constants';
import { useDeleteComment, useListenComment, useSendComment, useUpdateComment, useUpdateEmotionComment } from '../workTask.hook';

function ComponentComment() {
  const [active, setActive] = useState({});
  const { dataTask, profile ,assign:{managers}} = useTaskItemStore();
  const [employee] = useProfile();
  const [dataComment] =useListenComment(dataTask?._id);
  const [, handleComment] = useSendComment();
  const [, handleEmotion] = useUpdateEmotionComment();
  const [, handleDeleteComment] = useDeleteComment();
  const [, handleUpdateComment] = useUpdateComment();

  const edit = (id: any) => {
    setActive((e: any) => ({ [id]: !e?.[id] }));
  };

  const deleteComment = (param: any) => {
    handleDeleteComment(param);
  };

  return (
    <div style={{ width: 'inherit', maxWidth: 1000 }}>
      <div className="comment-context">
        <CommentTask
          readOnly={false}
          active={undefined}
          action={(value : any) =>{ 
            if(!(value).trim()){
              return;
            }
            handleComment({ content: value, taskId: dataTask?._id })}
          }
          autoFocus={false}
        />
      </div>
      <div className="comment-body">
        {(dataComment).map(
          (value: any, index: any) => (
            <CommentItem
              key={value._id}
              {...{
                value,
                employee,
                active,
                dataTask,
                handleUpdateComment,
                deleteComment,
                handleEmotion,
                profile,
                edit,
                managers
              }}
            ></CommentItem>
          )
        )}
      </div>
    </div>
  );
}

export default ComponentComment;

interface PropsCommentItem {
  value?: any;
  employee?: any;
  active?: any;
  dataTask?: any;
  handleUpdateComment?: any;
  deleteComment?: any;
  handleEmotion?: any;
  profile?: any;
  edit?: any;
  managers?: any
};
function CommentItem({
  value,
  employee,
  active,
  dataTask,
  handleUpdateComment,
  deleteComment,
  handleEmotion,
  profile,
  edit,
  managers
}: PropsCommentItem) {
  const [htmlContent, setHtmlContent] = useState(value.content);
  const _update = useCallback((item: any) => {
    edit(value._id);
    if (htmlContent !== value.content) {
      handleUpdateComment({
        content: item,
        taskId: dataTask?._id,
        commentId: value._id
      });
    }
  }, [dataTask?._id, edit, handleUpdateComment, htmlContent, value._id, value.content]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeValue = useMemo(() => (!isNil(get(value,'updateDateComment') )? get(value,'updateDateComment') : get(value,'date')),[value.date,value.updateDateComment]);
  const [getDate, setDate] = useState(moment());
  useEffect(() => {
    let time =setInterval(function() {
      setDate(moment())
    }, 58000);
    
    return ()=>{
      clearInterval(time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.date,value.updateDateComment]);
  return (
    <div
      key={value._id}
      style={{
        width: 'inherit',
        display: 'flex',
        flexDirection:
          String(employee._id) !==
          String(get(value, 'createdById', get(value, 'createdBy._id', '')))
            ? 'row-reverse'
            : 'row'
      }}
    >
      <div
        style={{
          paddingTop: 9,
          minWidth: 60,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Avatar
          size={38}
          src={
            includes(value.createdBy.avatar, 'http://') ||
            includes(value.createdBy.avatar, 'https://')
              ? value.createdBy.avatar
              : ''
          }
          style={{ backgroundColor: '#fcc499' }}
        >
          {getShortName(get(value, 'createdBy.fullName', ''))}
        </Avatar>
      </div>
      <div style={{ width: 'auto', marginBottom: 28 }}>
        <CommentTask
          readOnly
          active={Boolean(active?.[value._id])}
          isEdit={true}
          action={(item: any) => {
            console.log(JSON.stringify(item))
            if(!(item).trim()){
              return
            }
            _update(item);
          }}
          autoFocus={false}
          value={value.content}
          onChange={setHtmlContent}
        />
        <Space  >
          <Text>
            {moment(getDate).diff(moment(timeValue), 'd') <= 1
              ? moment(timeValue).fromNow()
              : moment(timeValue).format('DD/MM/YYYY HH:mm A')}&nbsp;{ !!(get(value,'updateDateComment',false))&&`(đã sửa)` }
          </Text>
          {!!!active[value._id] ? (
            <>
              <CanShow 
                rule={[...managers.map(({_id}: any)=>_id),get(value,'createdById',get(value,'createBy._id',false))]} 
                permission={profile?._id}
              >
                <Button
                  style={{ padding: '0 2px' }}
                  type="text"
                  onClick={() => edit(value._id)}
                >
                  <EditOutlined />
                </Button>
             
              <Button
                style={{ padding: '0 2px' }}
                type="text"
                onClick={() =>
                  deleteComment({ taskId: dataTask?._id, commentId: value._id })
                }
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
              </CanShow>
            </>
          ) : (
            <>
              <Button
                style={{ padding: '0 4px' }}
                size="small"
                type="primary"
                onClick={() => {
                  _update(htmlContent);
                }}
              >
                Lưu
              </Button>
              <Button
                style={{ padding: '0 4px' }}
                size="small"
                onClick={() => {
                  _update(value.content);
                }}
              >
                Huỷ
              </Button>
            </>
          )}
          <Tooltip
            color="#CEDEFB"
            title={
              Object.values(get(value, 'emotion', {})).length ? (
                <Space direction="horizontal">
                  {Object.values(get(value, 'emotion', {})).map((val: any) => (
                    <Text>{val}</Text>
                  ))}
                </Space>
              ) : (
                ''
              )
            }
            trigger={['hover']}
            mouseEnterDelay={0.3}
            overlayStyle={{ color: 'white' }}
          >
            <Button
              style={{ padding: '0 2px' }}
              type="text"
              onClick={(e) => {
                handleEmotion({
                  taskId: dataTask?._id,
                  commentId: value._id,
                  user: { [profile._id]: profile.fullName }
                });
              }}
            >
              {value?.emotion?.[profile._id] ? ( <HeartFilled style={{ color: 'red' }} /> ) : ( <HeartOutlined /> )}
              {!!Object.keys(get(value, 'emotion', {})).length && (
                <Text>{Object.keys(get(value, 'emotion', {})).length}</Text>
              )}
            </Button>
          </Tooltip>
        </Space>
      </div>
      <div
        style={{
          paddingTop: 9,
          minWidth: 60,
          display: 'flex',
          justifyContent: 'center'
        }}
      />
    </div>
  );
}
interface PropsCanShow{
  children?: any,
  rule?: any,
  permission?: any
}
function CanShow ({children,rule,permission}: PropsCanShow) {
  if(Boolean(rule.includes(permission))){
    return children
  }
  return <></>
}
