import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Collapse, Flex, Popconfirm, Spin } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModalAnt from '~/components/common/Antd/ModalAnt';
import Loading from '~/components/common/Loading/index';
import ScheduleItemList from '~/modules/scheduleItem/components/ScheduleItemList';
import { useDeleteSchedule, useGetSchedulesByCourseId } from '../schedule.hook';
import { ScheduleBase } from '../schedule.modal';
import ScheduleAdd from './ScheduleAdd';
type propsType = {

}


export default function ScheduleList(props:propsType) : React.JSX.Element {
  const [open,setOpen] = useState(false);
  const [id,setId] = useState<any>();
  const {id : courseId} = useParams();
  const [data,loading] = useGetSchedulesByCourseId(courseId);
  const [isSubmitLoading,onDelete] = useDeleteSchedule();
  const onOpen = useCallback((i : any) => {
    setId(i);
    setOpen(true);
  },[]);
  const onClose = useCallback(() => {
    setId(null);
    setOpen(false);
  },[]);
  const handleUpdateSchedule = (e :any ,id : string) => {
    e.stopPropagation();
    onOpen(id);
  }
  const dataSource = useMemo(() => data?.map((item : ScheduleBase) => ({
    key: item?._id,
    label: item?.name || "",
    children: [
      <ScheduleItemList dataSource={item?.scheduleItem || []} scheduleId={item._id}/>,
    ],
    extra : isSubmitLoading ? <Spin spinning/> : <Flex gap={10}>
      <EditOutlined onClick={(e) => handleUpdateSchedule(e,item?._id)}/>
      <Popconfirm onConfirm={() => onDelete(item?._id)} title="Xác nhận xoá">
      <DeleteOutlined onClick={(e) => e.stopPropagation()}/>
      </Popconfirm>
    </Flex>
  })),[data]);
  
    return (
      <>
      {loading ? <Loading />: <Collapse items={dataSource} defaultActiveKey={['1']} />}
      <ModalAnt title={"Cập nhật lộ trình học"} open={open} onCancel={onClose} centered>
      <ScheduleAdd id={id} action='UPDATE' onCancel={onClose}/>
      </ModalAnt>
      </>

    )
}