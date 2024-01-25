import { InboxOutlined } from '@ant-design/icons'
import { Image, Modal, Upload, notification } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '~/constants/defaultValue'
import { useProgressContext } from './TaskProgress'
import { clone, get } from 'lodash'

interface Props {

};

const propsUpload = {
  name: 'file',
  multiple: true,
  action: `${BASE_URL}/api/v1/file-more/todo`,
  beforeUpload: (file: any) => {
    // console.log(file)
    // const maxSize = 5 * 1024 * 1024; // 5MB, ví dụ giới hạn kích thước là 2MB

    // if (file.size > maxSize) {
    //   message.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 2MB.');
    //   return false;
    // }

    return true;
  },
};

function UploadFileProgress() {
const [tempFileList,setFileListTemp]=useState([])
  const { setFileList, onUpdateProgress, index, item, progress } = useProgressContext();

  const onChange =({file,fileList}: any) => {
    setFileListTemp(fileList);
    if (file?.status === 'done') {
      const progressId = get(progress,'_id');
      let cloneItem = [...item]
      const data = JSON.parse(JSON.stringify([...item]))
      const convertFile = (fileItem: any)=>{
        return {
          name:fileItem.name,
          url:fileItem.response?.url??'',
        }
      }
      if(!data[1]?.fileList)
        Object.assign(data[1],{fileList:[]})
      

        data[1].fileList.push(convertFile(file))
        onUpdateProgress(progressId,index,data);
        setFileListTemp(fileList);
        setFileList((e: any)=> [...e,...fileList?.map(convertFile)]);
        setTimeout(()=>{
          setFileListTemp([])
        },1000)


      notification.success({message:`${file.name} tải lên thành công.`});
    } else if (file?.status === 'error') {
      notification.error({message:`${file.name} tải lên thất bại.`});
    }

  }
  return (
    <Upload.Dragger 
      { ...{...propsUpload,onChange,fileList:tempFileList,}}
      listType="text"  >
      <InboxOutlined />
        <Text> Chọn hoặc kéo thả file vào đây</Text>
    </Upload.Dragger>
  )
}

export default UploadFileProgress
