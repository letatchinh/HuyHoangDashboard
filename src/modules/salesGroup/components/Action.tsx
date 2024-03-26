import {
    ApartmentOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    MoreOutlined,
    SisternodeOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Popconfirm, Tooltip } from "antd";
import { get } from "lodash";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { SALES_GROUP_GEOGRAPHY } from "../constants";
import { RulesLeader, RulesMember } from "../salesGroup.service";
import useSalesGroupStore from "../salesGroupContext";
const RulesMemberMethod = new RulesMember();
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
  const existMember = RulesMemberMethod.isExist(
    get(rc, "salesGroupPermission", [])
  );
  const notExistLeader = !RulesLeaderMethod.isExist(
    get(rc, "salesGroupPermission", [])
  );
  const isZone = get(rc, "typeArea") === SALES_GROUP_GEOGRAPHY.ZONE;

  const items: MenuProps["items"] = [
    {
      label: (
        <Tooltip
          title={
            isZone || existMember || notExistLeader
              ? "Đã có TDV hoặc đã là nhóm nhỏ hoặc không có quản lý"
              : ""
          }
        >
          <Button
            disabled={existMember || isZone || notExistLeader}
            block
            icon={<SisternodeOutlined />}
            onClick={() =>
              onOpenFormCreateGroupFromExistGroup({
                parentNear: _id,
                parentNearName: get(rc, "name", ""),
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