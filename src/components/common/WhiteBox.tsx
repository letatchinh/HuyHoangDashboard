import React from 'react';
type propsType = {
    children : React.ReactNode,
    className? : string,
    title? : string,
    style? :  React.CSSProperties,
    noPadding? : boolean
}
export default function WhiteBox({children,className,noPadding,style = {},title}:propsType) : React.JSX.Element {
    return (
        <div style={{...style, marginTop: '20px'}} className={`whiteBox ${className ?? ""} ${noPadding ? 'p-0' : ''}`}>
            {title && <div className='whiteBox--header'>
                <h5>{title}</h5>
            </div>}
            <div className='whiteBox--body'>
            {children}
            </div>
        </div>
    )
}