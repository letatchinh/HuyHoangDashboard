import React from 'react';
type propsType = {
    children : React.ReactNode,
    className? : string,
}
export default function WhiteBox({children,className}:propsType) : React.JSX.Element {
    return (
        <div className={`whiteBox ${className}`}>
            {children}
        </div>
    )
}