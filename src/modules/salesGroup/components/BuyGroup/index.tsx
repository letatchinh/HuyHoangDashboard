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
import React, { useCallback, useState } from "react";
import LoadingTree from "~/components/Antd/LoadingTree";
import ModalAnt from "~/components/Antd/ModalAnt";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import apis from "~/modules/collaborator/collaborator.api";
import { useCreateCollaborator, useGetCollaborator, useRemoveProductCollaborator, useUpdateCollaborator, useUpdateProductCollaborator } from "~/modules/collaborator/collaborator.hook";
import CollaboratorAddress from "~/modules/collaborator/components/CollaboratorAddress";
import CollaboratorForm from "~/modules/collaborator/components/CollaboratorForm";
import CollaboratorProduct from "~/modules/collaborator/components/CollaboratorProduct";
import { useAddProductEmployee } from "~/modules/employee/employee.hook";
import { useBuyGroupQueryParams, useGetBuyGroups } from "../../salesGroup.hook";
import { BuyGroupType } from "../../salesGroup.modal";
type propsType = {};

export default function BuyGroup(props: propsType): React.JSX.Element {
  // const [expandedKeys,setExpandedKeys] = useState<React.Key[]>([]);
  const [id, setId] = useState<any>();
  const [query] = useBuyGroupQueryParams();
  const [data, isLoading] = useGetBuyGroups(query);

  const [open, setOpen] = useState(false);
  const onOpen = useCallback((id?: any) => {
    if (id) {
      setId(id);
    }
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null)
  }, []);
  const [isSubmitLoading, handleCreate] = useCreateCollaborator(() => {
    onClose();
  });
  const [, handleUpdate] = useUpdateCollaborator(() => {
    onClose();
  });
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
            // expandedKeys={expandedKeys}
            // onSelect={(newExpandedKeys,{node}) => {
            //   const isIn = expandedKeys.some((key) => node.key === key);
            //   if(isIn){
            //     setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
            //   }else{
            //     setExpandedKeys([...expandedKeys,...newExpandedKeys])
            //   }
            // }}
            // onExpand={(newExpandedKeys,{node}) => {
            //   const isIn = expandedKeys.some((key) => node.key === key);
            //   if(isIn){
            //     setExpandedKeys(expandedKeys.filter((key) => key !== node.key))
            //   }else{
            //     setExpandedKeys([...expandedKeys,...newExpandedKeys])
            //   }
            // }}
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
                      onClick={() => onOpen(get(data, "_id"))}
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
          <h4 >
        {`${!id ? "Tạo mới " : "Cập nhật"}`} cộng tác viên
      </h4>
        <Tabs
        destroyInactiveTabPane
        items={[
          {
            key: '1',
            label: 'Hồ sơ',
            children: <CollaboratorForm
            id={id}
            handleCloseModal={onClose}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            isSubmitLoading={isSubmitLoading}
          />
          },
          {
            key: '2',
            label: "Sản phẩm đảm nhiệm",
            children: <CollaboratorProduct id={id} useAddProduct={useAddProductEmployee} useRemoveProduct={useRemoveProductCollaborator} useUpdateProduct={useUpdateProductCollaborator} useGetUser={useGetCollaborator} apiSearchProduct={apis.searchProduct}/>,
            disabled : !id
          },
          {
            key: '3',
            label: "Sổ địa chỉ",
            children: <CollaboratorAddress id={id}/>,
            disabled : !id
          }
        ]}>
        </Tabs>
      </ModalAnt>
    </div>
  );
}
