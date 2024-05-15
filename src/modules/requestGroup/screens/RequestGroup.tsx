import React from 'react';
import RequestGroupComponents from '../components'
type propsType = {

}
export default function RequestGroup(props:propsType) : React.JSX.Element {
    return (
        <RequestGroupComponents.CreateAndView  mode='all' showCreate={false}/>
    )
}