import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import { useGetlistRankingById, useDeleteRanking, useUpdateRanking,useCreateRanking,useResetAction } from '../ranking.hook';
interface Props {
  id?: any;
  handleCloseForm?: () => void;
  setId?:any;
};
interface FieldType {
  id: string
  name: string
  note: string
  level: string
}
const { TextArea } = Input;
const RankingForm: React.FC<Props> = ({ id,setId, handleCloseForm }) => {
  const [, createRanking] = useCreateRanking(handleCloseForm);
  const [rankingConfigById, isLoading] = useGetlistRankingById(id);
  const [form] = Form.useForm(); 
   const [, updateRanking] = useUpdateRanking(handleCloseForm);
   useResetAction();
  useEffect(() => {
    if (id && rankingConfigById) { 
      const { name, level }: FieldType = rankingConfigById;
      form.setFieldsValue({
        name,
        level,
      });
    }else {
      form.resetFields();
    }
  }, [id,rankingConfigById,form]);
  const onFinish = useCallback((values: FieldType) => {
     const data: FieldType = {
      ...values,
      };
      if (id) {
        updateRanking({ ...data, id });
        setId(null);
      }else {
        createRanking({ ...data });
        form.resetFields()
      };
  },[updateRanking,createRanking,id]);
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
        <Form.Item<FieldType> label="Tên hạng" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Xếp hạng hãng sản xuất" name="level">
          <Input />
        </Form.Item>
        <Form.Item style={{ width: '950px'}} wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RankingForm;
