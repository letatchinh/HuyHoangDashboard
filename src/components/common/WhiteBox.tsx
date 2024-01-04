import React from 'react';
type propsType = {
    children : React.ReactNode,
    className? : string,
    style? :  React.CSSProperties 
}
export default function WhiteBox({children,className,style = {}}:propsType) : React.JSX.Element {
    return (
        <div 
        style={style}
        className={`whiteBox ${className}`}>
            {children}
        </div>
    )
}