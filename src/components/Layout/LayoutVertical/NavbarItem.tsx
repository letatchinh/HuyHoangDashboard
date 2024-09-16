import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
type propsType = {
    path : string | undefined,
    label : string,
}
export default function NavbarItem({path,label}:propsType) : any {
    const target = useRef(null);
    return path ? 
        <NavLink
        ref={target}
        className={() => `layoutVertical--content__navbar__list__item__navLink`}
        to={path}
      >
        {label}
      </NavLink>
      : label
    
}