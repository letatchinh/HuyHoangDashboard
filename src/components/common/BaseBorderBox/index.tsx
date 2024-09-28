import React from 'react';

import { Divider } from 'antd';

import './index.scss';
type propsType = {
    children : React.ReactNode,
    title? : any,
    style? : React.CSSProperties,
    styleContent? : React.CSSProperties,
}
const BaseBorderBox = ({
  children,
  title,
  style={},
  styleContent = {}
}:propsType) => {

  return (
    <div
      style={style}
      className='base-border-box'
    >
      <Divider
        className='base-border-box__divider'
        orientation="left"
      >
        <h6>{title}</h6>
      </Divider>
      <div
      style={styleContent}
        className='base-border-box__content'
      >
        {children}
      </div>
    </div>
  )
}

export default BaseBorderBox;
