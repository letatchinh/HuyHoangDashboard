import React from 'react';
import { BranchProviderContext } from '../store/BranchContext';
import BranchScreen from './Branch';
type propsType = {

}
export default function BranchRoot(props:propsType) : React.JSX.Element {
  return (
    <BranchProviderContext>
      <BranchScreen/>
    </BranchProviderContext>
  )
}