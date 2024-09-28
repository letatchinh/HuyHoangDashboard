import { Button, Flex } from "antd";
import React from "react";
type propsType = {
  id?: string;
  loading : boolean;
};
export default function BtnSubmit({ id,loading }: propsType): React.JSX.Element {
  return (
    <Flex justify={"center"}>
      <Button loading={loading} type="primary" htmlType="submit">
        {id ? "Cập nhật" : "Tạo mới"}
      </Button>
    </Flex>
  );
}
