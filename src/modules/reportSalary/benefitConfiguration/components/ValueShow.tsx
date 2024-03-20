import { Button, Flex, InputNumber, Popover } from "antd";
import React, { useState } from "react";
import { useCreateConfig } from "../benefitConfiguration.hook";
import FormValue from "./FormValue";
type propsType = {
  value: number;
  conditionId?: any;
  benefitId?: any;
  mutate: () => void;
};
export default function ValueShow({
  value: defaultValue,
  benefitId,
  conditionId,
  mutate,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <Popover
    destroyTooltipOnHide
      open={open}
      onOpenChange={handleOpenChange}
      trigger={["click"]}
      content={
        <FormValue
          mutate={mutate}
          hide={hide}
          defaultValue={defaultValue}
          benefitId={benefitId}
          conditionId={conditionId}
        />
      }
    >
      <Button type="text">{defaultValue} %</Button>
    </Popover>
  );
}
