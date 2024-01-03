import React from 'react';
type propsType = {
    children : React.ReactNode,
    className? : string,
    noPadding?: boolean,
}
export default function WhiteBox({children,className,noPadding}:propsType) : React.JSX.Element {
    return (
        <div className={`whiteBox ${className ?? ""} ${noPadding ? 'p-0' : ''}`}>
            {children}
        </div>
    )
}