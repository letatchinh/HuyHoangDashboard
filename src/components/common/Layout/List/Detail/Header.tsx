import {
  CloseOutlined,
  DeleteOutlined,
  DownCircleFilled,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Flex, Modal, Popconfirm, Typography } from "antd";
import Search from "antd/lib/input/Search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { COLOR, STATUS, STATUS_NAMES } from "~/constants/defaultValue";
import BtnAdd from "../Header/BtnAdd";

type PropsHeaderLeft = {
  onAdd: () => void;
  SearchProp?: {
    openSearch : () => void,
    open : boolean,
    onClose : () => void,
    onSearch : (p?:any) => void,
    SearchComponent : any
  };
  onChangeStatus: (status: any) => void;
  allowSearch? : boolean
};
const HeaderLeft = ({ onAdd, onChangeStatus,allowSearch = true,SearchProp }: PropsHeaderLeft) => {
  return (
    <Flex justify={"space-between"} align="center">
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            {
              label: "Tất cả",
              key: "all",
              onClick: () => onChangeStatus(null),
            },
            {
              label: STATUS_NAMES.ACTIVE,
              key: STATUS.ACTIVE,
              onClick: () => onChangeStatus(STATUS.ACTIVE),
            },
            {
              label: STATUS_NAMES.INACTIVE,
              key: STATUS.INACTIVE,
              onClick: () => onChangeStatus(STATUS.INACTIVE),
            },
          ],
        }}
      >
        <Typography.Title level={5} style={{ cursor: "pointer" }}>
          Trạng thái <DownOutlined style={{ color: COLOR.primary }} />
        </Typography.Title>
      </Dropdown>
      <Flex gap={10}>
        <BtnAdd onClick={onAdd} />
        {allowSearch && <SearchOutlined onClick={SearchProp && SearchProp?.openSearch} />}
      </Flex>

      <Drawer
        rootClassName="drawerMidCenter"
        placement={"top"}
        closable={false}
        onClose={SearchProp && SearchProp?.onClose}
        open={SearchProp?.open}
        key={'headerLeftSearch'}
      >
        {SearchProp?.SearchComponent && SearchProp?.SearchComponent}
        <Flex align={'center'} gap={10} style={{marginTop : 10}}>
            <Button type="primary" onClick={SearchProp?.onSearch}>Tìm kiếm</Button>
            <Button  onClick={SearchProp?.onClose}>Huỷ</Button>
        </Flex>
      </Drawer>
    </Flex>
  );
};

type PropsHeaderRight = {
  name: any;
  onEditClick: () => void;
  onDeleteClick: () => void;
  path: string;
};
const HeaderRight = ({
  name,
  onEditClick,
  onDeleteClick,
  path,
}: PropsHeaderRight) => {
  const navigate = useNavigate();
  return (
    <Flex justify={"space-between"} align="center">
      {name}
      <Flex gap={10}>
        <Button
          type="primary"
          ghost
          onClick={onEditClick}
          icon={<EditOutlined />}
        />
        <Popconfirm title="Xác nhận xoá" onConfirm={onDeleteClick}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
        <Button
          onClick={() => navigate(path)}
          type="text"
          icon={<CloseOutlined />}
        />
      </Flex>
    </Flex>
  );
};

export default {
    HeaderLeft,
    HeaderRight
}