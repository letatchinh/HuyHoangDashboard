import React from 'react';
import './index.scss'
type propsType = {
    loading? : boolean
}
export default function Loading({loading}:propsType) : React.JSX.Element {
    return loading ? <div className='loading--container'>
            <div className="loading--container__element"/>
        </div> : <></>
    
}