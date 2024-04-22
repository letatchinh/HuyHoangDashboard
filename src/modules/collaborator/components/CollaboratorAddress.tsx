import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, List, Popconfirm, Skeleton, Switch, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useGetCollaborator,
  useUpdateAddressCollaborator,
} from "~/modules/collaborator/collaborator.hook";
import { concatAddress } from "~/utils/helpers";
import { AddressPartnerType } from "../collaborator.modal";
import CollaboratorAddressForm from "./CollaboratorAddressForm";
type propsType = {
  id?: any;
};
export default function CollaboratorAddress({
  id,
}: propsType): React.JSX.Element {
  const [collaborator, isLoading]: any = useGetCollaborator(id);
  const dataSource : AddressPartnerType[] = useMemo(() => get(collaborator, "addressStories", []),[collaborator]);
  const [open,setOpen] = useState(false);
  const [dataUpdate,setDataUpdate] = useState<AddressPartnerType | null>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onOpen = useCallback((address?:AddressPartnerType) => {
    if(address) {
      setDataUpdate(address)
    }
    setOpen(true);
  },[]);
  const onClose = useCallback(() => {
    setDataUpdate(null);
    setOpen(false);
    setSelectedRowKeys([]);
  },[]);
  const [isSubmitLoading, updateAddress] = useUpdateAddressCollaborator(onClose);
  const onRemove = useCallback((data : AddressPartnerType[]) => updateAddress({
    method : 'delete',
    data,
    id,
  }),[id]);
  const onRemoveMulti = useCallback(() => {
    const deleteList = dataSource?.filter((data : AddressPartnerType) => selectedRowKeys.includes(data?.hash || ""));
    onRemove(deleteList);
  },[dataSource,selectedRowKeys]);
  const onUpdate = useCallback((data : AddressPartnerType[]) => updateAddress({
    method : 'update',
    data,
    id,
  }),[id]);

  const onChangeDefault = useCallback((data : AddressPartnerType) => {
    onUpdate([{
      ...data,
      isDefault : true
    }])
  },[]);
  
  const columns : ColumnsType = [
    {
      title : <Flex gap={10} align='center'>
        Địa chỉ
        <Button size="small" type="primary" onClick={() => onOpen()} icon={<PlusOutlined />}>Thêm địa chỉ</Button>
        {selectedRowKeys.length ? <Popconfirm title={`Xoá ${selectedRowKeys.length} Lựa chọn?`} onConfirm={onRemoveMulti}>
          <Button size="small" danger>Xoá</Button>
        </Popconfirm> : null}
      </Flex>,
      key : 'address',
      render : (item,record) => concatAddress(record),
    },
    {
      title : "Mặc định",
      key : 'isDefault',
      dataIndex : 'isDefault',
      align : 'center',
      render : (isDefault,record) => isDefault ? <Tag color={'green'}>Mặc định</Tag> : <Switch size="small" checked={isDefault} onChange={() => onChangeDefault(record)}/>,
    },
    {
      title : "Thao tác",
      key : 'action',
      align : 'center',
      render : (item,record : AddressPartnerType) => <Flex justify={'center'} gap={5}>
        <Button size="small" type="primary" ghost onClick={() => onOpen(record)}>Sửa</Button>
        |
        <Popconfirm title="Xác nhận xoá" onConfirm={() => onRemove([record])}>
        <Button size="small" danger ghost>Xoá</Button>
        </Popconfirm>
      </Flex>,
    },
  ]
  return (
    <div>
      
      <TableAnt 
      rowSelection={rowSelection}
      rowKey={rc => rc?.hash}
      loading={isLoading}
      dataSource={get(collaborator, "addressStories", [])}
      columns={columns}
      pagination={false}
      size='small'
      />
      <ModalAnt destroyOnClose title={dataUpdate ? "Cập nhật" : "Tạo mới" + " địa chỉ"} width={1000} open={open} onCancel={onClose} centered footer={null}>
        <CollaboratorAddressForm initialValues={dataUpdate} id={id} handleUpdate={updateAddress}/>
      </ModalAnt>
    </div>
  );
}
