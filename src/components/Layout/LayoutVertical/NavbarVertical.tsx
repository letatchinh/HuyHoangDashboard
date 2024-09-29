import { MenuProps } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { resource } from './resourceV2';
import { ItemTypeNavbar, resource } from "./resource";
import { useGetPolicies } from "~/modules/policy/policy.hook";

/**
 *
 * FIXME: ACTIVE NAVBAR IS NOT WORKING
 */

type MenuItem = Required<MenuProps>["items"][number];
type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
  permission?: any;
};

function getItem({ label, icon, children, key, permission,path }: ItemType): any {
  return {
    key,
    icon,
    children,
    permission,
    label,
    path,
  } as MenuItem;
}
function loopRenderNav(element: (typeof resource)[number]) {
  const render = element;
  if (element.children?.length) {
    render.children = element.children.map(loopRenderNav);
  }
  return getItem(render);
};
const NavbarVertical: React.FC = () => {
  const location = useLocation();
  const [policy] = useGetPolicies();
  const navigate = useNavigate();
  const onGo = (path? : string) => {
    console.log(path,'path');
    
    if(path){
      console.log(path,'path');
      navigate(path);
    }
  }
  const NewNavbarItems = resource.map(loopRenderNav);
  return (
    <div className="layoutVertical--content__navbar">
      <div className="layoutVertical--content__navbar__list">
        {NewNavbarItems?.map((item: ItemTypeNavbar) => (
          <div
            key={item.key}
            onClick={() => onGo(item?.path)}
            className={`layoutVertical--content__navbar__list__item ${location.pathname === item?.path ? 'active' : ''}`}
          >
            <span className="layoutVertical--content__navbar__list__item__icon">
              {item?.icon && item?.icon}
            </span>
            <span className="layoutVertical--content__navbar__list__item__label">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavbarVertical;
