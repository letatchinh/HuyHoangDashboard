import {
  DeleteOutlined,
  EditOutlined,
  FileDoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Popconfirm } from "antd";
import React, { useCallback, useState } from "react";
import playIcon from "~/assets/icons/Play.svg";
import ModalAnt from "~/components/common/Antd/ModalAnt";
import { useDeleteScheduleItem } from "../scheduleItem.hook";
import { ScheduleItemBase } from "../scheduleItem.modal";
import ScheduleItemForm from "./ScheduleItemForm";
type propsType = {
  scheduleId: string;
  dataSource: ScheduleItemBase[];
};

export default function ScheduleItemList({
  scheduleId,
  dataSource,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [dataItemUpdate, setDataItemUpdate] = useState<any>();
  const [isSubmitLoading, onDelete] = useDeleteScheduleItem();
  const onOpen = useCallback((i?: any) => {
    i && setDataItemUpdate(i);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setDataItemUpdate(null);
    setOpen(false);
  }, []);

  return (
    <>
      {dataSource?.map((item,i) => (
        <Flex
          key={i}
          style={{ borderBottom: "1px solid lightgrey" }}
          align={"center"}
          justify={"space-between"}
          className="course-item-wrapper"
        >
          <div className="course-item">
            {item.contentType === "video" ? <div style={{width:16,height:16}}><img src={playIcon} /></div> : <FileDoneOutlined />}
            <span className="course-item--title">{item.name}</span>
            {/* {item.contentType === 'video' && <span className='course-item--time'><ClockIcon /> {item.time}</span>} */}
          </div>
          <Flex gap={10}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined onClick={() => onOpen(item)} />}
            />
            <Popconfirm
              title="Xác nhận xoá"
              onConfirm={() =>
                onDelete({ id: item?._id, scheduleId: item?.scheduleId })
              }
            >
              <Button type="text" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Flex>
        </Flex>
      ))}
      <Button
        style={{ marginTop: 5 }}
        loading={isSubmitLoading}
        onClick={() => onOpen()}
        type="primary"
        icon={<PlusOutlined />}
      >
        Thêm lộ trình
      </Button>
      <ModalAnt
        title={dataItemUpdate ? "Câp nhật" : "Tạo mới" + " lộ trình"}
        open={open}
        destroyOnClose
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <ScheduleItemForm
          scheduleId={scheduleId}
          dataItemUpdate={dataItemUpdate}
          onCancel={onClose}
        />
      </ModalAnt>
    </>
  );
}
