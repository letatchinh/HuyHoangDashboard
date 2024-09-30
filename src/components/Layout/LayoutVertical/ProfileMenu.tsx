import { CaretDownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal, Typography } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetProfile, useLogout } from "~/modules/auth/auth.hook";
import { authActions } from "~/modules/auth/redux/reducer";
import ModalProfile from "./ModalProfile";
import { useUpdateStaff } from "~/modules/staff/staff.hook";
type propsType = {};
type LayoutItemProps = {
  icon: React.JSX.Element,
  title: string,
  onClick?: () => void,
};
const defaultAvatar = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors% 2Favatar& psig=AOvVaw24 - OIEsARjPTS0Pi6kleZT & ust=1727623227362000 & source=images & cd=vfe & opi=89978449 & ved=0CBEQjRxqFwoTCKCznZj45YgDFQAAAAAdAAAAABAE'

const LayoutItem = ({icon,title,onClick}:LayoutItemProps) => <div className="d-flex align-items-center gap-1">
    {icon}
    <Typography.Text onClick={onClick} className="fw-5">{title}</Typography.Text>
</div>

export default function ProfileMenu(props: propsType): React.JSX.Element {
  const navigator = useNavigate()
  const [,onLogout] = useLogout(()=>navigator('/login',{replace:true}));
  const profile = useGetProfile();
  const dispatch = useDispatch();
  useEffect(() => {;
    dispatch(authActions.getProfileRequest());
  }, []);

  // const resetStateUpdateProfile = () => dispatch(userSliceAction.reset());

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
    // resetStateUpdateProfile();
  };
  
  const [isLoadingSubmit, handleUpdateProfile] = useUpdateStaff(() => {
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
      label: <LayoutItem icon={<LogoutOutlined/>} title="Đăng xuất" />,
      key: "1",
      onClick: () => onLogout(),
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
        {get(profile,'profile.avatar') ?<Avatar style={{backgroundColor : '#fff'}} src={get(profile,'profile.avatar',defaultAvatar)}></Avatar> : <UserOutlined />}
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
