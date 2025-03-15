import React from "react";
import { Context } from "../context";
import { HeaderDetail } from "../components";
type propsType = {};
function TestDetail_(props: propsType): React.JSX.Element {
  return (
    <>
      <HeaderDetail ></HeaderDetail>
    </>
  );
}
export default function TestDetail(props: propsType): React.JSX.Element {
  return (
    <Context.Detail>
      <TestDetail_ />
    </Context.Detail>
  );
}
