import { Avatar } from 'antd';
import { get, includes } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import useTaskItemStore from '~/store/TaskItemContext';
import { getShortName } from './constants';

interface props {
  readOnly?:boolean
  value?:any
  action?:any
  active?:boolean
  autoFocus?:boolean
  isEdit?:boolean
  onChange?: any
};
export default function CommentTaskLine({ readOnly, value, action, active, autoFocus, isEdit, onChange }: props): React.JSX.Element {
  const [htmlContent, setHtmlContent] = useState<any>(value?.content??'');
  const {assign : { users,canAssign}} = useTaskItemStore();
  const listUserAvaible =useMemo(()=> (users??[]).map(({_id,fullName}: any)=>({id:_id,display:(fullName).trim()})),[users])
  useEffect(()=>{
    setHtmlContent(value?.content)
    if(typeof onChange==='function') {
      onChange(value)
    }
  },[value,onChange])
  const handleInputChange = (e: any) => {
    setHtmlContent(e.target.value);
    if(typeof onChange==='function')
      onChange(e.target.value)
  };

  return (
    <div
      className='comment-item-line'
    >
      <div
        style={{
          paddingTop: 9,
          minWidth: 60,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Avatar
          size={38}
          src={
            includes(value.createdBy.avatar, "http://") ||
            includes(value.createdBy.avatar, "https://")
              ? value.createdBy.avatar
              : ""
          }
          style={{ backgroundColor: "#fcc499" }}
        >
          {getShortName(get(value, "createdBy.fullName", ""))}
        </Avatar>
      </div>
      <div>
      <p
        style={{
          padding: '0px',
          margin:'0px'
        }}
      >Người tạo</p>
      <p
        style={{
          padding: '0px',
          margin:'0px'
        }
        }>{value?.content}</p>
      </div>
    </div>
  )
}