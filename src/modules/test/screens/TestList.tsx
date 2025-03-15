import React from "react";
import { Context } from "../context";
import { SearchTestList, TableTestList } from "../components";
import Breadcrumb from "~/components/common/Breadcrumb";


const { Container , useContainer} = Context;
type propsType = {};
function TestList_(props: propsType): React.JSX.Element {
   
  return <>
    <Breadcrumb title={'Bộ đề thi thử'}/>
    <TableTestList />
  </>;
}



export default function TestList() {
  return (
    <Container>
      <TestList_ />
    </Container>
  );
}
