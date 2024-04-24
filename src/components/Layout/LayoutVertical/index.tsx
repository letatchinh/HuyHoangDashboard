import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '~/assets/images/logo.png';
import NavbarVertical from './NavbarVertical';
import ProfileMenu from './ProfileMenu';
import Reflex from './Reflex';
import { DeviceDetector } from '~/utils/helpers';
import NavbarVerticalDevice from './NavbarVerticalDevice';
import NotificationDropdown from '~/modules/notification/screens';

export default function LayoutVertical({ children }: { children: React.JSX.Element }) {
  const navigate = useNavigate();
  const device = DeviceDetector();
  return (
    <div className='layoutVertical'>
        <header className='layoutVertical--header'>
          <div className='layoutVertical--header__row'>
            <div className='layoutVertical--header__row__logo' onClick={() => navigate("/")}>
              <img src={logo}/>
            </div>
          <div className='layoutVertical--header__row__right'>
              <div>
              <NotificationDropdown />
              </div>
              <div className='layoutVertical--header__row__profile'>
                <ProfileMenu />
              </div>
            </div>
          </div>
      </header>
      <Reflex
            LeftComponent={  !device.isMobile ? <NavbarVertical /> :  <NavbarVerticalDevice /> }
            RightComponent={<div className='layoutVertical--content__mainContent'>
            {children}
            </div>}
            />
    </div>
  )
}
