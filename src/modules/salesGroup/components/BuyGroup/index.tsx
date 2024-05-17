import { DownOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ConfigProvider,
  Flex,
  Row,
  Tabs,
  Tag,
  Tree,
  Typography,
} from "antd";
import { get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingTree from "~/components/Antd/LoadingTree";
import ModalAnt from "~/components/Antd/ModalAnt";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import apis from "~/modules/collaborator/collaborator.api";
import { useAddProductCollaborator, useCreateCollaborator, useGetCollaborator, useRemoveProductCollaborator, useUpdateCollaborator, useUpdateProductCollaborator } from "~/modules/collaborator/collaborator.hook";
import CollaboratorAddress from "~/modules/collaborator/components/CollaboratorAddress";
import CollaboratorForm from "~/modules/collaborator/components/CollaboratorForm";
import CollaboratorProduct from "~/modules/collaborator/components/CollaboratorProduct";
import { useAddProductEmployee, useRemoveProductEmployee, useUpdateProductEmployee,useGetEmployee, useCreateEmployee, useUpdateEmployee } from "~/modules/employee/employee.hook";
import apisEmployee from "~/modules/employee/employee.api";
import { useBuyGroupQueryParams, useGetBuyGroups } from "../../salesGroup.hook";
import { BuyGroupType } from "../../salesGroup.modal";
import EmployeeForm from "~/modules/employee/components/EmployeeForm";
type propsType = {};

export default function BuyGroup(props: propsType): React.JSX.Element {
  // const [expandedKeys,setExpandedKeys] = useState<React.Key[]>([]);
  const [id, setId] = useState<any>();
  const [typeUser, setTypeUser] = useState<any>();
  const [query] = useBuyGroupQueryParams();
  const [data, isLoading] = useGetBuyGroups(query);

  const [open, setOpen] = useState(false);
  const onOpen = useCallback((id?: any,type?:any) => {
    if (id) {
      setId(id);
    }
    if(type){
      setTypeUser(type);
    }
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null);
    setTypeUser(null)
  }, []);
  const [isSubmitLoading, handleCreate] = useCreateCollaborator(() => {
    onClose();
  });
  const [, handleUpdate] = useUpdateCollaborator(() => {
    onClose();
  });
  const [isSubmitLoadingEmployee, handleCreateEmployee] = useCreateEmployee(() => {
    onClose();
  });
  const [, handleUpdateEmployee] = useUpdateEmployee(() => {
    onClose();
  });
  let items = useMemo(
    () => [
      {
        key: "1",
        label: "Hồ sơ",
        children:
          typeUser === "partner" ? (
            <CollaboratorForm
              id={id}
              handleCloseModal={onClose}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
              isSubmitLoading={isSubmitLoading}
            />
          ) : (
            <EmployeeForm
              id={id}
              handleCloseModal={onClose}
              handleUpdate={handleUpdateEmployee}
              handleCreate={handleCreateEmployee}
              isSubmitLoading={isSubmitLoadingEmployee}
            />
          ),
      },
      {
        key: "2",
        label: "Sản phẩm đảm nhiệm",
        children: (
          <CollaboratorProduct
          target={typeUser}
          config={{
            discount : {
              discountType : 'PERCENT',
              value : typeUser === "partner" ? 10  : 45
            }

          }}
            id={id}
            useAddProduct={
              typeUser === "partner"
                ? useAddProductCollaborator
                : useAddProductEmployee
            }
            useRemoveProduct={
              typeUser === "partner"
                ? useRemoveProductCollaborator
                : useRemoveProductEmployee
            }
            useUpdateProduct={
              typeUser === "partner"
                ? useUpdateProductCollaborator
                : useUpdateProductEmployee
            }
            useGetUser={
              typeUser === "partner" ? useGetCollaborator : useGetEmployee
            }
            apiSearchProduct={
              typeUser === "partner"
                ? apis.searchProduct
                : apisEmployee.searchProduct
            }
          />
        ),
        disabled: !id,
      },
    ],
    [id, typeUser, isSubmitLoading, isSubmitLoadingEmployee]
  );
  useEffect(() => {
    if(typeUser === 'partner'){
      items.push({
        key: '3',
        label: "Sổ địa chỉ",
        children: <CollaboratorAddress id={id}/>,
        disabled : !id
      })
    }
  },[typeUser])
  return (
    <div className="buy_group">
      <div
        style={{
          background: "white",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 999,
          borderBottom: "1px #F0F0F0 solid",
          marginBottom: 5,
        }}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={() => onOpen()}
          className="mb-2"
          type="primary"
        >
          Thêm mới cộng tác viên
        </Button>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Tree: {
              /* here is your component tokens */
            },
          },
        }}
      >
        {isLoading ? (
          <LoadingTree />
        ) : (
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={data}
            blockNode
            titleRender={(node) => {
              const data: BuyGroupType | undefined = get(node, "data");
              return (
                <Flex justify={"space-between"} align={"center"} wrap="nowrap">
                  <Flex gap={5} align="center">
                    <AvatarShortOrName
                      src={get(data, "avatar")}
                      name={get(data, "fullName")}
                    />
                    <Typography.Text
                      strong
                      onClick={() => onOpen(get(data, "_id"),get(data,'type'))}
                    >
                      {get(data, "code", "")} - {get(data, "fullName", "")}
                    </Typography.Text>
                  </Flex>
                  <div style={{ width: "40vw" }}>
                    <Row
                      gutter={16}
                      style={{ width: "100%", boxSizing: "border-box" }}
                    >
                      <Col span={12}>
                        <Tag
                          color={
                            get(data, "type") === "partner"
                              ? "#2db7f5"
                              : "#108ee9"
                          }
                        >
                          {get(data, "type") === "partner"
                            ? "Cộng tác viên"
                            : "Trình dược viên"}
                        </Tag>
                      </Col>
                      <Col span={12}>
                        <PhoneOutlined style={{ color: "#3481ff" }} />:{" "}
                        <Typography.Text copyable>
                          {get(data, "phoneNumber")}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </div>
                </Flex>
              );
            }}
          />
        )}
      </ConfigProvider>
      <ModalAnt
        destroyOnClose
        width={1050}
        open={open}
        onCancel={onClose}
        footer={null}
        className="modalScroll"
        centered
      >
        <h4>{`${!id ? "Tạo mới " : "Cập nhật"}`} cộng tác viên</h4>
        <Tabs
        destroyInactiveTabPane
        items={items}>
        </Tabs>
      </ModalAnt>
    </div>
  );
}
