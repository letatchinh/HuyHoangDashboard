import { Button, Popover } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import { TypeBenefit } from "../benefitConfiguration.modal";
import FormCondition from "./FormCondition";
type propsType = {
  cond: any;
  rc: any;
  typeBenefit?: TypeBenefit | null;
  mutate: () => void;
};
export default function ConditionShow ({
  cond,
  rc,
  typeBenefit,
  mutate,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  
  const { isRanger, gte, lt } = cond || {};

  if (isRanger) {
    return (
      <Popover
        trigger={["click",'contextMenu']}
        content={
          <FormCondition
            initData={rc}
            id={get(rc, "_id")}
            onCancel={hide}
            mutate={mutate}
            typeBenefit={typeBenefit}
          />
        }
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="text" >{`Từ ${gte}% - dưới ${lt}%`}</Button>
      </Popover>
    );
  }
  return <></>;
}
