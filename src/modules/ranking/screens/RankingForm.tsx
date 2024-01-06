import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import { useGetlistRankingById, useDeleteRanking, useUpdateRanking,useCreateRanking } from '../ranking.hook';
import {useGetManufacturerList} from '../../manufacturer/manufacturer.hook';
import { filterAcrossAccents } from '~/utils/helpers';
interface Props {
  id?: any;
  handleCloseForm?: () => void;
  
}

interface FieldType {
  id: string
  name: string
  note: string
  level: string
}
const { TextArea } = Input;
const RankingForm: React.FC<Props> = ({ id, handleCloseForm }) => {
    const query = useMemo(() => ({ limit: 10, page: 1 }), []);
    const [listManufacturer, isLoadingManufacturer] = useGetManufacturerList(query);
    console.log(listManufacturer,'listManufacturer');
    const [selectedValue, setSelectedValue] = useState(null);
  const [, createRanking] = useCreateRanking(handleCloseForm);
  const [rankingConfigById, isLoading] = useGetlistRankingById(id);
  const [form] = Form.useForm(); 
   const [, updateRanking] = useUpdateRanking(handleCloseForm);
  useEffect(() => {
    if (id && rankingConfigById) { 
      const { name, level }: FieldType = rankingConfigById;
      form.setFieldsValue({
        name,
        level,
      });
    }
  }, [id,rankingConfigById]);

  const onFinish = useCallback((values: FieldType) => {
    console.log('Received values of form: ');
     const data: FieldType = {
      ...values,
      // code:'DMT0001'
      // status:'',
      };
      if (id) {
        updateRanking({ ...data, id });
      }else {
        createRanking({ ...data });

      }
  },[updateRanking,createRanking,id]);
  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <Form
          name="basic"
          labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
          wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
          labelAlign="left"
          style={{ maxWidth: 800 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item<FieldType> label="Tên hãng" name="name">
        {isLoadingManufacturer && listManufacturer ? (
  <Spin>Loading...</Spin>
) : (
  <Select
    filterOption={filterAcrossAccents}  // Ensure that the filterOption function is correctly defined
    showSearch
    disabled={id?true:false}
    options={listManufacturer?.map((item: any) => ({
      label: item.name,
      value: item.name
    }))}
    onChange={(value: any) => {
      setSelectedValue(value)
    }}
    value={selectedValue}
  />
)}

        </Form.Item>
        <Form.Item<FieldType> label="Xếp hạng ranking" name="level">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RankingForm;
