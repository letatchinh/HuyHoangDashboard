import { Flex, Typography } from 'antd';
import React, { useMemo } from 'react';
import { BASE_URL } from '~/constants/defaultValue';
type propsType = {
    fileName: string;
    src : any;
}
export default function FileCustom({fileName,src}:propsType) : React.JSX.Element {
    const fileName_ = useMemo(() => fileName.split('/').pop(),[fileName])
    return (
        <Flex>
            <Typography.Link href={`${BASE_URL}api/image?pathFile=${src}`}>{fileName_}</Typography.Link>
        </Flex>
    )
}