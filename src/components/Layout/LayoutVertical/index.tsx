import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '~/assets/images/logo.png';
import NavbarVertical from './NavbarVertical';
import ProfileMenu from './ProfileMenu';

export default function LayoutVertical({ children }: { children: React.JSX.Element }) {
  const navigate = useNavigate();
  return (
    <div className='layoutVertical'>
        <header className='layoutVertical--header'>
          <div className='layoutVertical--header__row'>
            <div className='layoutVertical--header__row__logo' onClick={() => navigate("/")}>
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
