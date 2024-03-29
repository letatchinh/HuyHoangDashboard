import {
  ApartmentOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  SisternodeOutlined
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Popconfirm, Tooltip } from "antd";
import { get } from "lodash";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { RulesLeader } from "../salesGroup.service";
import useSalesGroupStore from "../salesGroupContext";
const RulesLeaderMethod = new RulesLeader();
type PropsType = {
  _id: string;
  rc: any;
};
const Action = ({ _id, rc }: PropsType) => {
  const {
    isSubmitLoading,
    onOpenForm,
    onOpenFormCreateGroupFromExistGroup,
    onOpenFormRelation,
    deleteSalesGroup,
  } = useSalesGroupStore();
  const notExistLeader = !RulesLeaderMethod.isExist(
    get(rc, "salesGroupPermission", [])
  );

  const items: MenuProps["items"] = [
    {
      label: (
        <Tooltip
          title={
              notExistLeader
              ? "Đã có TDV hoặc đã là nhóm nhỏ hoặc không có quản lý"
              : ""
          }
        >
          <Button
            disabled={ notExistLeader}
            block
            icon={<SisternodeOutlined />}
            onClick={() =>
              onOpenFormCreateGroupFromExistGroup({
                parentNear: _id,
                parentNearPath: get(rc, "managementArea", [])?.map(
                  (area: any) => get(area, "path")
                ),
              })
            }
            size="small"
            type="dashed"
          >
            Tạo nhóm
          </Button>
        </Tooltip>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          block
          icon={<ApartmentOutlined />}
          onClick={() => onOpenFormRelation(_id)}
          size="small"
          type="primary"
          ghost
        >
          Xem tổng thể
        </Button>
      ),
      key: "1",
    },

    {
      label: (
        <Button
          block
          icon={<InfoCircleOutlined />}
          onClick={() => onOpenForm(_id)}
          size="small"
          type="primary"
        >
          Xem chi tiết
        </Button>
      ),
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: (
        <WithPermission permission={POLICIES.DELETE_AREACONFIGURATION}>
          <Popconfirm
            title="Bạn muốn xoá địa chỉ này?"
            onConfirm={() => deleteSalesGroup(_id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              block
              loading={isSubmitLoading}
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xoá
            </Button>
          </Popconfirm>
        </WithPermission>
      ),
      key: "4",
    },
  ];

  return (
    <Dropdown
    placement="bottomLeft"
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <Button type="primary" shape="circle" icon={<MoreOutlined />}></Button>
    </Dropdown>
  );
};

export default Action;