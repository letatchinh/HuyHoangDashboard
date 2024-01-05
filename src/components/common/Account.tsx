import React from 'react';
import { Input, Row, Col, Skeleton, Form, Tooltip, Badge } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const formItemLayoutLong = {
  labelCol: { sm: 24, md: 24, lg: 8, xl: 8 },
  wrapperCol: { sm: 24, md: 24, lg: 16, xl: 16 }
};

interface Props{
  isLoading?: boolean,
  required?: boolean | true;
};

const Account = ({ isLoading, required }: Props) => {
  
  return (
    <>
      <h5 style={{ marginBottom: 20 }}>Thiết lập tài khoản:</h5>

      <Row gutter={48} align="middle" justify="space-between">
        <Col span={12}>
          <Form.Item
            name="username"
            label={<Tooltip
              placement='topRight'
              zIndex={2001}
              // title={<div>
              //   <p >- Chỉ được nhập: kí tự hoa, thường, số, @ _ .</p>
              //   <p >- Tối thiểu 4, tối đa 30 ký tự </p>
              //   <p >- Không được chứa dấu cách </p>
              // </div>}
              title={<p>Hệ thống tự động tạo</p>}
            >
              <Badge
                size="small"
                color="#9B9999"
                offset={[14, 4]}
                count={<QuestionCircleOutlined />}
              >
                <span>Tài khoản </span>
              </Badge>
            </Tooltip>}
            rules={[
              {
                required: true,
                pattern: new RegExp(/^[A-Za-z0-9_@.]{1,30}$/),
                message: 'Xin vui lòng nhập đúng tên tài khoản!'
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Input disabled = {false} autoComplete="off" />
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        <Col span={12}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required,
                message: 'Xin mời nhập mật khẩu!'
              },
              { min: 6, message: 'Mật khẩu phải dài ít nhất 6 ký tự' }
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Input.Password autoComplete="off" />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            dependencies={['password']}
            {...formItemLayoutLong}
            rules={[
              {
                required,
                message: 'Xin mời nhập lại mật khẩu!'
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                }
              })
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Input.Password autoComplete="new-password" />
            )}
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default Account;
