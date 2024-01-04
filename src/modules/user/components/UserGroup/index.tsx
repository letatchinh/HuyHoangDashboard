import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm } from "antd";
import SelectSearch from "~/components/common/SelectSearch";


const styleButton = {
  alignContent: 'center'
};
interface UserGroupProps {}

const UserGroup = ({}: UserGroupProps) => {
  return (
    <div>
      <div className="employee-group__header">
        <h5 className="employee-group__list-title ">
          Thiết lập quyền
        </h5>
        <Flex
          gap="small"
          wrap="wrap"
          style={{
            alignContent: 'center',
          }}
        >
        {/* <WithPermission permission={POLICY.DELETE_USERGROUP}> */}
                <Popconfirm
                  title="Bạn muốn xoá chi nhánh này?"
                  // onConfirm={() => deleteGroup(group._id)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <Button
              size="small" type="primary" danger
              style={styleButton}
              >
                    <DeleteOutlined /> Xoá
                  </Button>
                </Popconfirm>{' '}
              {/* </WithPermission> */}

              {/* <WithPermission permission={POLICY.UPDATE_USERGROUP}> */}
                <Button
                  size="small"
                  // onClick={() => onOpenForm(group)}
                  type="primary"
                >
                  <EditOutlined /> Cập nhật
                </Button>
              {/* </WithPermission> */}

              {/* <WithPermission permission={POLICY.WRITE_USERGROUP}> */}
                <Button
                  size="small"
                  // onClick={() => onOpenForm({})}
                  type="primary"
                >
                  <PlusOutlined /> Tạo mới
                </Button>
              {/* </WithPermission> */}
        </Flex>
      </div>
      <SelectSearch
        showSelect={false}
      />
    </div>
  );
};

export default UserGroup;
