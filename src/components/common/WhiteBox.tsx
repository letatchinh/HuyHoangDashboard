import React from 'react';
type propsType = {
    children : React.ReactNode,
    className? : string,
    style? :  React.CSSProperties,
    noPadding? : boolean
}
export default function WhiteBox({children,className,noPadding,style = {}}:propsType) : React.JSX.Element {
    return (
        <div style={style} className={`whiteBox ${className ?? ""} ${noPadding ? 'p-0' : ''}`}>
            {children}
        </div>
    )
}