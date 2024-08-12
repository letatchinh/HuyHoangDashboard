import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Flex, Form, Input, Select, Spin } from 'antd';
import { useGetlistRankingById, useDeleteRanking, useUpdateRanking,useCreateRanking,useResetAction, useGetlistRankingById_onlyGet } from '../ranking.hook';
import RenderLoading from '~/components/common/RenderLoading';
interface Props {
  id?: any;
  handleCloseForm?: () => void;
  setId?:any;
  setDestroy?:any;
  readOnly?:any;
};
interface FieldType {
  id: string
  name: string
  note: string
  level: string
}

const hookGetData = {
  readOnly : useGetlistRankingById_onlyGet,
  notReadOnly : useGetlistRankingById
}

const RankingForm: React.FC<Props> = ({ id,setId, handleCloseForm,setDestroy,readOnly }) => {
  const [, createRanking] = useCreateRanking(() => {
    handleCloseForm && handleCloseForm();
    setDestroy  && setDestroy(true);
  });
  const [rankingConfigById, isLoading] : any = readOnly ? hookGetData.readOnly() : hookGetData.notReadOnly(id)

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
        {RenderLoading(isLoading,<Input readOnly={readOnly}/>)}
        </Form.Item>
        <Form.Item<FieldType> label="Cấp độ xếp hạng" name="level">
        {RenderLoading(isLoading,<Input readOnly={readOnly}/>)}
        </Form.Item>
          {!readOnly && <Flex justify={'center'}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          </Flex>}
      </Form>
    </>
  );
};

export default RankingForm;
