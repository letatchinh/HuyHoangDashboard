import React from 'react';
import SelectDebounceProduct from '~/modules/product/components/SelectDebounceProduct';
import SelectProductGroup from '~/modules/product/components/SelectProductGroup';
type propsType = {
    refCollection : 'product' | 'product_group',
    index : number,
    form : any
};
export default function SelectIds({refCollection,index,form}:propsType) : React.JSX.Element {

    if(refCollection === 'product_group') return <SelectProductGroup fieldName={[index,'id']} showLabel={false} allowCreate={false} isLoading={false}/>
    if(refCollection === 'product') return <SelectDebounceProduct fieldName={[index,'id']} value={form.getFieldValue(['targetIds',index,'id'])}/>
    return <></>
}