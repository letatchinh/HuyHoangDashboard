import { Button, Flex, Popconfirm, Popover } from "antd";
import React, { useCallback, useState } from "react";
import BonusOtherForm from "./BonusOtherForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useUpdatePreviewReportEmployee } from "../reportEmployee.hook";
import { SubmitDataUpdatePreview } from "../reportEmployee.modal";

export default function UpdateAndDelete({
  _id,
  bonusOther,
  employeeId,
  indexUpdate,
}: any): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const hide = useCallback(() => {
        setOpen(false);
      },[])
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
    };
    const [isSubmitLoadingPreview, onPreviewUpdate] =
    useUpdatePreviewReportEmployee(hide);
    const onRemove = () => {
        const submitData :SubmitDataUpdatePreview =  {
            _id,
            employeeId,
            bonusOther : bonusOther?.filter((item:any,index:number) => index !== indexUpdate)
        }
        onPreviewUpdate(submitData)
      };
      
  return (
    <span style={{width : 200}}>
    <Popconfirm title="Xác nhận xóa" onConfirm={onRemove}>
    <Button loading={isSubmitLoadingPreview} type="text">
        <DeleteOutlined style={{color : 'red'}} />
      </Button>
    </Popconfirm>
      <Popover
      destroyTooltipOnHide
      open={open}
      onOpenChange={handleOpenChange}
      trigger={['click']}
        content={
             <BonusOtherForm
            employeeId={employeeId}
            bonusOther={bonusOther}
            _id={_id}
            indexUpdate={indexUpdate}
          />
        }
      >
        <Button loading={isSubmitLoadingPreview} type="text">
          <EditOutlined />
        </Button>
      </Popover>
    </span>
  );
}
