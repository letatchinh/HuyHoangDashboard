import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Collapse, Flex, Modal, Popconfirm, Spin } from 'antd';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '~/components/common/Loading/index';
import ScheduleItemAdd from '~/modules/scheduleItem/components/ScheduleItemAdd';
import ScheduleItemList from '~/modules/scheduleItem/components/ScheduleItemList';
import { useDeleteSchedule, useGetSchedulesByCourseId } from '../schedule.hook';
import { ScheduleBase } from '../schedule.modal';
import ScheduleAdd from './ScheduleAdd';
type propsType = {

}


export default function ScheduleList(props:propsType) : React.JSX.Element {
  const [modal, contextModel] = Modal.useModal();

  const {id : courseId} = useParams();
  const [data,loading] = useGetSchedulesByCourseId(courseId);
  const [isSubmitLoading,onDelete] = useDeleteSchedule();

  const handleUpdateSchedule = (e :any ,id : string) => {
    e.stopPropagation();
    modal.confirm({
      title: "Cập nhật Lộ trình học",
      content: <ScheduleAdd id={id} action='UPDATE'/>,
      footer: null,
      icon : null,
      width : 450,
      closable : true
    });
  }
  const dataSource = useMemo(() => data?.map((item : ScheduleBase) => ({
    key: item?._id,
    label: item?.name || "",
    children: [
      <>
      <ScheduleItemList dataSource={item?.scheduleItem || []} id={item._id}/>
      
      </>,
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
      {contextModel}
      {loading ? <Loading />: <Collapse items={dataSource} defaultActiveKey={['1']} />}
      </>

    )
}