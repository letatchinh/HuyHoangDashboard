import React, { useEffect, useMemo, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import defaulStyleMentionCommentTask from './defaulStyleMentionCommentTask';
import { Button, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useTaskItemStore from '~/store/TaskItemContext';

interface Props {
  readOnly?:boolean
  value?:string
  action?:any
  active?:boolean
  autoFocus?:boolean
  isEdit?:boolean
  onChange?: any
};
const CommentTask = ({readOnly,value,action,active,autoFocus,isEdit,onChange}: Props) => {
  const [htmlContent, setHtmlContent] = useState<any>(value??'');
  const {assign : { users,canAssign}} = useTaskItemStore();

  const listUserAvaible =useMemo(()=> (users??[]).map(({_id,fullName}: any)=>({id:_id,display:(fullName).trim()})),[users])
  useEffect(()=>{
    setHtmlContent(value)
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
    <>
      <MentionsInput
        rows={4}
        minLength={1}
        className={'mentionsInput_custom'}
        style={defaulStyleMentionCommentTask}
        readOnly={(isEdit?(!active):readOnly)}
        autoFocus={autoFocus}
        value={htmlContent}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if(!e.shiftKey&&e.code==='Enter'){
            setTimeout(() =>{
              setHtmlContent(isEdit?htmlContent:'');
            },0)

            if(typeof action==='function'){
              action((htmlContent??"").trim())
            }
            return e.stopPropagation()
          }
        }}
      >
        <Mention
          trigger="@"
          displayTransform={(username, display) => ` @${display} `}
          markup="@[__display__](__id__)"
          data={listUserAvaible}
          appendSpaceOnAdd
          style={{
            backgroundColor: 'rgb(100, 151, 239)',
            padding: '1px 0',
            borderRadius: 3
          }}
          className="mentionsInput_custom_ssuggest"
        />
      </MentionsInput>
      {
        !!!readOnly&&  <div style={{flexShrink:1}}>
        <Button htmlType='button' onClick={()=>{

          if(typeof action==='function'){
            action((htmlContent??'').trim())
          }
          setHtmlContent('')
          }} style={{borderRadius:6}} type='primary'>
          <SendOutlined />
        </Button>
      </div>
      }
     
    </>
  );
};

export default CommentTask;
