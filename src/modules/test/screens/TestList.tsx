import React from "react";
import { Context } from "../context";
import { SearchTestList, TableTestList } from "../components";


const { Container , useContainer} = Context;
type propsType = {};
function TestList(props: propsType): React.JSX.Element {
   
  return <>
    <TableTestList />
  </>;
}



export default function () {
  return (
    <Container>
      <TestList />
    </Container>
  );
}
