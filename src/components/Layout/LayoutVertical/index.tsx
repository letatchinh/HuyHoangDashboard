import React from 'react'
import logo from '~/assets/images/header/logo-white.svg';
import NavbarVertical from './NavbarVertical';
import ProfileMenu from './ProfileMenu';

export default function LayoutVertical({children} : {children : React.JSX.Element}) {
  return (
    <div className='layoutVertical'>
        <header className='layoutVertical--header'>
          <div className='layoutVertical--header__row'>
            <div className='layoutVertical--header__row__logo'>
              <img src={logo}/>
            </div>
            <div className='layoutVertical--header__row__profile'>
              <ProfileMenu />
            </div>
          </div>
        </header>
        <main className='layoutVertical--content'>
            <NavbarVertical />
            <div className='layoutVertical--content__mainContent'>
            {children}
            </div>
        </main>
    </div>
  )
}
