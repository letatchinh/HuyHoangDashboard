import { Flex } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "~/assets/images/logo.png";
import NavbarVertical from "./NavbarVertical";
import ProfileMenu from "./ProfileMenu";

export default function LayoutVertical({
  children,
}: {
  children: React.JSX.Element;
}) {
  const navigate = useNavigate();
  return (
    <div className="layoutVertical">
      <header className="layoutVertical--header">
        <div className="layoutVertical--header__row">
          <div
            className="layoutVertical--header__row__logo"
            onClick={() => navigate("/")}
          >
            {/* <img src={logo} /> */}
            LOGO
          </div>
          <div className="layoutVertical--header__row__right">
            <div></div>
            <div className="layoutVertical--header__row__profile">
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>
      <Flex>
      <NavbarVertical />
      <div className="layoutVertical--content__mainContent">{children}</div>
      </Flex>
    </div>
  );
}
