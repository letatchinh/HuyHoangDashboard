import React from 'react';
import { useCostManagementQueryParams, useGetCostManagements, useUpdateCostManagementParams } from '../costManagement.hook';
type propsType = {

}
export default function Test(props: propsType): React.JSX.Element {
  const [query] = useCostManagementQueryParams();
  console.log(query,'query'
  )
  const [costManagement, isLoading] = useGetCostManagements(query);
  // const [keyword, { setKeyword, onParamChange }] = useUpdateCostManagementParams(query);

  console.log(1)
  return (
    <div>Test</div>
  )
}