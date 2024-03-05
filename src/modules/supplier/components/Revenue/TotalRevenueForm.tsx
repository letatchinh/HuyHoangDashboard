import { Button, Col, DatePicker, Form, InputNumber, Row, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useNotificationStore from '~/store/NotificationContext';
import { formatNumberThreeComma } from '~/utils/helpers';
import { PROVIDER_COLLECTION_CONTRACT_MINERAL } from '../../supplier.modal';
type propsType = {
  totalRevenue: any,
  updateTotalRevenue: any,
  onClose: any,
  data: any
};

const { RangePicker } = DatePicker;
const dateFormat = 'DD-MM-YYYY';

export default function TotalRevenueForm({ totalRevenue, updateTotalRevenue, onClose, data}: propsType): React.JSX.Element {
  const [revenueValue, setRevenueValue] = useState<number | null | undefined>(0);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [date, setDate] = useState<any>();
  const {onNotify} = useNotificationStore();
  useEffect(() => {
    setRevenueValue(totalRevenue ?? 0);
  }, [totalRevenue]);

  useEffect(() => {
    setDate({
      startDate: data?.startDate,
      endDate: data?.endDate,
    });
  }, [data]);
  const onFinish = () => {
    try {
      if (date?.startDate && date?.endDate) {
        updateTotalRevenue({
          startDate: date?.startDate,
          endDate: date?.endDate,
          totalRevenue: revenueValue,
          supplierId: id,
          supplierMineralId: data?._id,
          providerCollection: PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier  //is default data table
        });
      } else {
        onNotify?.error("Vui lòng chọn thời gian");
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={12} style = {{marginBottom: 20}}>
          <Col span={12}>
            <h6>Doanh số khoán :</h6>
        </Col>
        <Col flex={1}>
          <InputNumber
            style={{
              width: "100%",
            }}
            value={revenueValue}
            onChange={(value) => setRevenueValue(value)}
            formatter={value => formatNumberThreeComma(value)}
            min={0}
          />
        </Col>
      </Row>
        <Row gutter={12} style = {{marginBottom: 20}}>
          <Col span={12}>
            <h6>Thời gian:</h6>
          </Col>
          <Col flex={1}>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <RangePicker
                format={dateFormat}
                allowEmpty={[false, false]}
                value={[(date?.startDate ? dayjs(date?.startDate) : null), date?.endDate ? dayjs(date?.endDate) : null]}
                onChange={(value) => {
                  setDate({
                    startDate: dayjs(value?.[0]).format("YYYY-MM-DD"),
                    endDate: dayjs(value?.[1]).format("YYYY-MM-DD"),
                  });
                }}
              />
            </Form.Item>
        </Col>
      </Row>
      <Row justify={"end"} style={{marginTop: 30}}>
        <Col span={4}>
          <Button
            onClick={onClose}
          >Huỷ</Button>
        </Col>
        <Col span={4}>
          <Button
              type="primary"
              htmlType='submit'
            // onClick={() => onUpdateRevenue(revenueValue, id)}
          >
            Cập nhật
          </Button>
        </Col>
        </Row>
      </Form>
    </div>
  )
}