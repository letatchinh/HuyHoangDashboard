import { DownOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, ConfigProvider, Flex, Row, Tag, Tree, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import LoadingTree from "~/components/Antd/LoadingTree";
import ModalAnt from "~/components/Antd/ModalAnt";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { useCreateCollaborator } from "~/modules/collaborator/collaborator.hook";
import CollaboratorForm from "~/modules/collaborator/components/CollaboratorForm";
import { useBuyGroupQueryParams, useGetBuyGroups } from "../../salesGroup.hook";
import { BuyGroupType } from "../../salesGroup.modal";
type propsType = {};


export default function BuyGroup(props: propsType): React.JSX.Element {
  // const [expandedKeys,setExpandedKeys] = useState<React.Key[]>([]);
  const [query] = useBuyGroupQueryParams();
  const [data, isLoading] = useGetBuyGroups(query);

  const [open,setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true),[]);
  const onClose = useCallback(() => setOpen(false),[]);
  const [isSubmitLoading, handleCreate] = useCreateCollaborator(() => {
    onClose();
  });
  return (
    <div className="buy_group" style={{ height: "200vh" }}>
      <Button icon={<PlusOutlined />} onClick={onOpen} className="mb-2" type="primary">
        Thêm mới cộng tác viên
      </Button>
      <ConfigProvider
        theme={{
          components: {
            Tree: {
              /* here is your component tokens */
            },
          },
        }}
      >
        {isLoading ? <LoadingTree /> :    
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
      defaultExpandedKeys={['0-0-0']}
      treeData={data}
      blockNode
      titleRender={(node) => {
        const data : BuyGroupType | undefined = get(node,'data');
        return <Row align={'middle'}>
          <Col span={6}>
          <Flex gap={5} align='center'>
          <AvatarShortOrName src={get(data,'avatar')} name={get(data,'fullName')}/>
          <Typography.Text strong>{get(data,'code','')} - {get(data,'fullName','')}</Typography.Text>
          </Flex>
          </Col>
          <Col span={4}>
          <Tag color={get(data,'type') === 'partner' ? '#2db7f5' : '#108ee9'}>{get(data,'type') === 'partner' ? 'Cộng tác viên' : 'Trình dược viên'}</Tag>
          </Col>
          <Col span={4}>
            <PhoneOutlined style={{color : '#3481ff'}}/>: <Typography.Text copyable>{get(data,'phoneNumber')}</Typography.Text>
          </Col>
        </Row>
      }}
    />}
      
      </ConfigProvider>
      <ModalAnt destroyOnClose width={1050} open={open} onCancel={onClose} footer={null}>
      <CollaboratorForm
              handleCloseModal={onClose}
              handleCreate={handleCreate}
              isSubmitLoading={isSubmitLoading}
            />,
      </ModalAnt>
    </div>
  );
}
