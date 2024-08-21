import { SelectProps } from 'antd/lib/index';
import React from 'react';
import DebounceSelectMultipleItemProduct from '~/components/common/DebounceSelectMultiple/DebounceSelectMultipleItemProduct';
import DebounceSelectMultipleItemProductGroup from '~/components/common/DebounceSelectMultiple/DebounceSelectMultipleItemProductGroup';
import SelectDebounceProduct from '~/modules/product/components/SelectDebounceProduct';
import SelectProductGroup from '~/modules/product/components/SelectProductGroup';
interface propsType extends SelectProps {
    refCollection : 'product' | 'product_group',
    index : number,
};
export default function SelectIds({refCollection,index,...props}:propsType) : React.JSX.Element {

    if(refCollection === 'product_group') return <DebounceSelectMultipleItemProductGroup {...props}/>
    if(refCollection === 'product') return <DebounceSelectMultipleItemProduct {...props}/>
    return <></>
}