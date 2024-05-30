import { Form, TreeSelect } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import GeoTreeSelect from '~/modules/geo/components/GeoTreeSelect';
import { RELATIVE_POSITION } from '~/modules/geo/constants';
type propsType = {
  form: any;
  id?: any;
  data?: any;
}
export default function SelectArea({ form, id, data }: propsType): React.JSX.Element {
const getPath = (managementArea : any[]) => managementArea?.map((area: any) =>get(area, "path"))
  
  const parentNearPath = useMemo(() => getPath(get(data, "address", [])),[data, id]);
  return (
    <Form.Item
    label="Khu vực"
    name={["managementArea"]}
    rules={[{ required: true, message: "Vui lòng chọn" }]}
  >
      <GeoTreeSelect
    autoClearSearchValue
    labelInValue={true}
    listItemHeight={200}
    multiple={true}
    showCheckedStrategy={TreeSelect.SHOW_ALL}
    showEnabledValuesOnly={true}
    showSearch={true}
    size="large"
    treeCheckStrictly={true}
    treeCheckable={true}
    treeDefaultExpandedKeys={['1', '2', '3']}
    checkablePositions={!parentNearPath ? [RELATIVE_POSITION.IS_CHILD, RELATIVE_POSITION.IS_EQUAL] : [RELATIVE_POSITION.IS_CHILD]}
    // enabledValues={parentNearPath?.length ? parentNearPath : null}
  />
  </Form.Item>
  )
}