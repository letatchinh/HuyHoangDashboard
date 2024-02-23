import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd';


interface Props {
  dataTask?: any;
  handleFinshed?: any;
  fileList_?: any;
  setFileList?: any;
};

export const useHookUpload=({dataTask,handleFinshed,fileList_,setFileList}: Props)=>{
  const [modal,contentProvider] = Modal.useModal()
  const [preview, setPreview] =useState(false);
  const [current, setSrc] =useState(0);
  const [tempFileList,setFileListTemp]=useState([]);

  
  useEffect(()=>{
    if(dataTask?.fileList){
      setFileList(dataTask?.fileList??[])
    }
  },[dataTask]);

  const onPreview = (event: any) => {
    const name = (event?.name ?? '').split('.');
    if (['jpeg', 'jpg', 'png'].includes(name.at(-1))) {
      setPreview(true);
      const index = fileList_
        .filter((event: any) => {
          const name = (event?.name ?? '').split('.');
          return ['jpeg', 'jpg', 'png'].includes(name.at(-1));
        })
        .findIndex((val: any) => val.name === event?.name);
      setSrc(index);
      return;
    };
    if (['mp4', 'mov'].includes(name.at(-1))) {
      modal.info({
        title: 'Nội dung',
        okText: false,
        bodyStyle: { padding: '2px !important', background: 'transparent' },
        style: { padding: '2px !important' },
        icon: false,
        okButtonProps: { style: { display: 'none' } },
        cancelText: false,
        width: '90%',
        closable: true,
        maskClosable: true,
        content: <div style={{ width: '100%' }}>
          <video autoPlay width="100%" controls >
            <source src={event.url} type="video/mp4" />Your browser does not support the video tag.
          </video>
        </div>
      })
      return;
    };
    notification.warning({ message: 'Loại tệp không hỗ trợ xem trước', placement: 'bottomRight', duration: 0.8, key: 'notification.warning' })
    return;
  };
  const convertFile = (fileItem : any)=>{
    return {
      name:fileItem.name,
      url:fileItem.response?.url??'',
    }
  }
  const onChange =({file,fileList}: any) => {
    setFileListTemp(fileList);
    if (file?.status === 'done') {
        setFileListTemp(fileList);
        let tempMemoryFileList : any = [];
        setFileList((e: any)=> {
          tempMemoryFileList = [...e,...fileList.filter(({status}: any)=>status!=='error').map(convertFile)];
          return tempMemoryFileList
        });
        setTimeout(()=>{
          setFileListTemp([])
        },1000)
        handleFinshed(tempMemoryFileList,'fileList')
      notification.success({message:`${file.name} tải lên thành công.`});
    } else if (file?.status === 'error') {
      notification.error({message:`${file.name} tải lên thất bại.`});
    }
  }
  const beforeUpload =(file : any)=>{
    let maxSize =10;
    if(file.size >=maxSize*1024 *1024){
      file.status = 'error'
      notification.error({message:`${file.name} dung lượng của file vượt quá mức ${maxSize}MB`});
      return Promise.reject(file)
    }
    return Promise.resolve(file)
  }
  const onRemove =(itemRemove : any) => {
    const tempMemoryFileList = [...fileList_];
    const removeItem = tempMemoryFileList.findIndex( (val) => val.name === itemRemove.name );    
    tempMemoryFileList.splice(removeItem, 1);

    handleFinshed(tempMemoryFileList,'fileList')
    setFileList(tempMemoryFileList);
  }

return {
  onPreview,
  onChange,
  onRemove,
  beforeUpload,
  state:{
      preview,
      current,
      fileList:fileList_,
      tempFileList,
  },
  handle:{
    setPreview,
    setFileList,
    setSrc,
    setFileListTemp,
  },
  contentProvider
}


}
