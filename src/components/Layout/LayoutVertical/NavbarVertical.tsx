import { Menu } from 'antd';
import React, { useState } from 'react';
import NavbarItems from './resource';





/**
 * 
 * FIXME: ACTIVE NAVBAR IS NOT WORKING
 */
const NavbarVertical: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);

  };


  
  return (
    <div className='layoutVertical--content__navbar'>
      {/* <button onClick={toggleCollapsed}>asd</button> */}
      <div className='layoutVertical--content__navbar__wrapMenu'>
    
      <Menu
      
      className='layoutVertical--content__navbar__wrapMenu__menu'
        mode="inline"
        inlineCollapsed={collapsed}
        items={NavbarItems}
        theme='dark'
      />
      </div>
    </div>
  );
};

export default NavbarVertical;
