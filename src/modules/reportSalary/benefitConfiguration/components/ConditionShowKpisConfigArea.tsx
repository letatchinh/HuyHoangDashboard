import { Button } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { AREA_VI } from '~/constants/defaultValue';
type propsType = {
    cond?:any
};

const CLONE_AREA_VI : any = AREA_VI;
export default function ConditionShowKpisConfigArea({cond}:propsType) : React.JSX.Element {
    const {subCond} = cond || {};
    return (
        <Button type='text' >
            {CLONE_AREA_VI?.[subCond] || ""}
        </Button>
    )
}