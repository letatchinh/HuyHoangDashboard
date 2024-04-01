import { Select } from 'antd';
import React from 'react';
import { OPTION_AREA } from '~/constants/defaultValue';
type propsType = {

}
export default function AreaSelect(props:propsType) : React.JSX.Element {
    return (
        <Select options={OPTION_AREA}/>
    )
}