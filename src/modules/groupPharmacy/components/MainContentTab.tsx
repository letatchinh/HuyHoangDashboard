
import React from 'react';
import { useParams } from 'react-router-dom';
import MainContentTabCommon from '~/components/common/Layout/List/Detail/MainContentTabCommon';
import { GroupPharmacyForm } from '../screens/GroupPharmacyForm';
type propsType = {

}
export default function MainContentTab(props:propsType) : React.JSX.Element {
    const {id} = useParams();

    return (
        <MainContentTabCommon items={[
            {
                key : '1',
                label : 'Thông tin',
                children : <GroupPharmacyForm id={id} readOnly />
            }
        ]}/>
    )
}