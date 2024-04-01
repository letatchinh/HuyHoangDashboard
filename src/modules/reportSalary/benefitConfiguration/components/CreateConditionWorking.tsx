import { Button } from "antd";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import FormConditionWorking from "./FormConditionWorking";
type propsType = {};
export default function CreateConditionWorking(
  props: propsType
): React.JSX.Element {
  // Condition
  const [openCondition, setOpenCondition] = useState(false);
  const onOpenCondition = useCallback(() => {
    setOpenCondition(true);
  }, []);
  const onCloseCondition = useCallback(() => {
    setOpenCondition(false);
  }, []);
  return (
    <div>
      <Button
        className="mb-2"
        type="primary"
        shape="round"
        onClick={onOpenCondition}
      >
        Thêm điều kiện
      </Button>
      <ModalAnt
        title="Thêm điều kiện"
        destroyOnClose
        open={openCondition}
        onCancel={onCloseCondition}
        footer={false}
      >
        <FormConditionWorking onCancel={onCloseCondition}/>
      </ModalAnt>
    </div>
  );
}
