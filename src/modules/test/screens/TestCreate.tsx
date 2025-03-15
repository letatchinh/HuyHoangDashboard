import React from "react";
import { Context } from "../context";
import { FormTest, HeaderDetail } from "../components";
import { Button } from "antd";
type propsType = {};
function TestCreate_(props: propsType): React.JSX.Element {
  return (
    <>
      <HeaderDetail>
        <Button type="primary">Tạo mới</Button>
      </HeaderDetail>
        <FormTest/>
    </>
  );
}
export default function TestCreate() {
  return (
    <Context.Create>
      <TestCreate_ />
    </Context.Create>
  );
}
