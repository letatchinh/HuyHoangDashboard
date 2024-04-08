import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import React, { useMemo } from "react";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { PROCESS_STATUS, PROCESS_STATUS_VI } from "../pharmacy.modal";
import { get } from "lodash";
type propsType = {
  onOpenForm: any;
  onDelete: any;
  _id: string;
  isSubmitLoading?: boolean;
  isShowConvert?: boolean;
  record?: any;
  onConvert?: any;
};
export default function ActionColumns({
  onOpenForm,
  onDelete,
  _id,
  isSubmitLoading,
  isShowConvert = false,
  record,
  onConvert,
}: propsType): React.JSX.Element {
  const typeColorButton = useMemo(
    () =>
      record?.processStatus === PROCESS_STATUS.APPROVED ? "#8ce312" : "#ff4141",
    [record]
  );
  return (
    <Space direction="vertical">
      {get(record, "processStatus") &&
        record?.processStatus === PROCESS_STATUS.NEW && (
          <>
            <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
              <Popconfirm
                title="Bạn muốn chuyển đổi nhà thuốc này thành chính thức?"
                onConfirm={() =>
                  onConvert({ _id, processStatus: PROCESS_STATUS.APPROVED })
                }
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button
                  block
                  icon={<PlusCircleTwoTone />}
                  type="primary"
                  size="small"
                >
                  Chuyển đổi
                </Button>
              </Popconfirm>
            </WithPermission>
            <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
              <Popconfirm
                title="Bạn muốn huỷ chuyển đổi nhà thuốc này?"
                onConfirm={() =>
                  onConvert({ _id, processStatus: PROCESS_STATUS.CANCELED })
                }
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button block size="small" danger>
                  Huỷ chuyển đổi
                </Button>
              </Popconfirm>
            </WithPermission>
          </>
        )}
      {get(record, "processStatus") &&
        record?.processStatus !== PROCESS_STATUS.NEW && (
          <Button
            style={{ backgroundColor: typeColorButton, color: "white" }}
            disabled
            size="small"
          >
            {PROCESS_STATUS_VI[record?.processStatus]}
          </Button>
        )}

      <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
        <Button
          block
          icon={<InfoCircleOutlined />}
          onClick={() => onOpenForm(_id)}
          size="small"
        >
          Cập nhật
        </Button>
      </WithPermission>

      <WithPermission permission={POLICIES.DELETE_PHARMAPROFILE}>
        <Popconfirm
          title="Bạn muốn xoá nhà cung cấp này?"
          onConfirm={() => onDelete(_id)}
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
    </Space>
  );
}
