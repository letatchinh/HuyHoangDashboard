import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import ModalAnt from '~/components/common/Antd/ModalAnt';
import ScheduleItemForm from './ScheduleItemForm';
type propsType = {
  scheduleId : string
}


export default function ScheduleItemAdd({scheduleId}:propsType) : React.JSX.Element {
  const [open,setOpen] = useState(false);
  const [id,setId] = useState<any>(false);

  const onOpen = useCallback((i? : any) => {
    i && setId(i);
    setOpen(true);
  },[]);
  const onClose = useCallback(() => {
    setId(null);
    setOpen(false);
  },[]);
  
    return (
      <>
      <Button onClick={() => onOpen()} type='primary' icon={<PlusOutlined />}>
        Thêm lộ trình
      </Button>
      <ModalAnt title={id ? "Câp nhật" : "Tạo mới" + " lộ trình"} open={open} destroyOnClose onCancel={onClose} footer={null}>
        <ScheduleItemForm scheduleId={scheduleId} id={id} onCancel={onClose}/>  
      </ModalAnt> 
      </>

    )
}