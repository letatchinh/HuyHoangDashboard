import { CaretDownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal, Typography } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ModalProfile from "~/components/common/TopBarDropDown/ModalProfile";
import AuthModule from "~/modules/auth";
import { authActions } from "~/modules/auth/redux/reducer";
import { userSliceAction } from "~/modules/user/redux/reducer";
import { useUpdateProfile } from "~/modules/user/user.hook";
import { useResetState } from "~/utils/hook";
type propsType = {};
type LayoutItemProps = {
    icon : React.JSX.Element,
    title : string,
    onClick? : () => void,
}
const LayoutItem = ({icon,title,onClick}:LayoutItemProps) => <div className="d-flex align-items-center gap-1">
    {icon}
    <Typography.Text onClick={onClick} className="fw-5">{title}</Typography.Text>
</div>

export default function ProfileMenu(props: propsType): React.JSX.Element {
  const [,onLogout] = AuthModule.hook.useLogout();
  const profile = AuthModule.hook.useGetProfile();
  const dispatch = useDispatch();
  useEffect(() => {;
    dispatch(authActions.getProfileRequest());
  }, []);

  const resetStateUpdateProfile = () => dispatch(userSliceAction.reset());

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
    resetStateUpdateProfile();
  };
  
  const [isLoadingSubmit, handleUpdateProfile] = useUpdateProfile(() => {
    onClose();
    dispatch(authActions.getProfileRequest());
  });

  const items: any[] = useMemo(() => [
    {
      label: <LayoutItem icon={<UserOutlined />} title="Hồ sơ cá nhân" /> ,
      key: "0",
      onClick: () => {setIsOpen(true)}
    },
    {
      type: "divider",
    },
    {
      label: <LayoutItem icon={<LogoutOutlined />} title="Đăng xuất" onClick={onLogout}/>,
      key: "1",
    },
  ],[]);
  return (
    <>
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <div className="profileBtn d-flex gap-1 align-items-center">
        <Avatar style={{backgroundColor : '#fff'}} src={get(profile,'profile.avatar')}></Avatar>
        <Typography.Text>{get(profile,'profile.fullName','')}</Typography.Text>
        <CaretDownOutlined />
      </div>
    </Dropdown>
      <Modal
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        width={1020}
        footer={null}
        className="form-modal"
        destroyOnClose
        zIndex={9999}
      >
        <ModalProfile handleUpdateProfile = {handleUpdateProfile} onCloseForm={() => setIsOpen(false)} isLoadingSubmit = {isLoadingSubmit} />
      </Modal>
    </>
  );
}
