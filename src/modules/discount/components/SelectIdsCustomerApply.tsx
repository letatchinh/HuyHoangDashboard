import React from 'react';
import SelectCollaborator from '~/modules/collaborator/components/SelectSearch';
import SelectPharmacy_V2 from '~/modules/sale/bill/components/SelectPharmacy_V2';
type propsType = {
    refCollection : 'pharma_profile' | 'partner',
    index : number,
    form : any
};
export default function SelectIdsCustomerApply({refCollection,index,form}:propsType) : React.JSX.Element {

    if(refCollection === 'pharma_profile') return <SelectPharmacy_V2 fieldName={[index,'id']} />
    if(refCollection === 'partner') return <SelectCollaborator />
    return <></>
}