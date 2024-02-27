import { Button, Col, DatePicker, Form, InputNumber, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatNumberThreeComma } from '~/utils/helpers';
type propsType = {
  totalRevenue: any,
  updateTotalRevenue: any,
  totalRevenueId: any,
  date: any,
  onClose: any
};
export default function TotalRevenueForm({ totalRevenue, updateTotalRevenue, totalRevenueId,date: dateDefault, onClose}: propsType): React.JSX.Element {
  const [revenueValue, setRevenueValue] = useState<number | null | undefined>(0);
  const { id } = useParams();
  // const defaultDate = useMemo(
  //   () => ({
  //     startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  //     endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  //   }),
  //   []
  // );
  const [date, setDate] = useState<any>();

  useEffect(() => {
    setRevenueValue(totalRevenue ?? 0);
  }, [totalRevenue]);

  useEffect(() => {
    setDate(dateDefault);
  }, [dateDefault]);

  const onFinish = (values: any) => {
    updateTotalRevenue({
      startDate: dayjs(date?.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(date?.endDate).format("YYYY-MM-DD"),
      totalRevenue: revenueValue,
      supplierId: id,
      supplierMineralId: totalRevenueId
    });
  };
  console.log(dayjs(date?.startDate),'dayjs(date?.startDate)')
  return (
    <div>
      <Form
        onFinish={onFinish}
      >
        <Row gutter={12} style = {{marginBottom: 20}}>
        <Col span={12}>Doanh số khoán :</Col>
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
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}>
            <DatePicker
                format="DD-MM-YYYY"
                value={date?.startDate ? dayjs(date?.startDate) : null}
                onChange={(date, dateString) => setDate((e: any) => ({
                  ...e,
                  startDate: dayjs(date).format("YYYY-MM-DD")
                }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngày kết thúc" name="endDate" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}>
            <DatePicker
                format="DD-MM-YYYY"
                onChange={(date, dateString) => setDate((e: any) => ({
                  ...e,
                  endDate: dayjs(date).format("YYYY-MM-DD")
                }))}
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