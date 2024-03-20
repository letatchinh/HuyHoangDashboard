import { Typography } from 'antd';
import React, { useMemo } from 'react';
import { convertAddress } from '../salesGroup.service';
type propsType = {
    managementArea?: any[],
    onlyShowLastPath?: boolean
}
export default function Address({managementArea,onlyShowLastPath}:propsType) : React.JSX.Element {
    const addressString = useMemo(() => convertAddress(managementArea,onlyShowLastPath),[managementArea,onlyShowLastPath])
    return (
        <div>
            {addressString?.map((item : any) => <Typography.Text style={{display : 'block'}} strong>
                {item}
            </Typography.Text>)}
        </div>
    )
}