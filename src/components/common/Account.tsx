import React, { useState } from 'react';
import { Input, Row, Col, Skeleton, Form, Tooltip, Badge, Switch } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const formItemLayoutLong = {
  labelCol: { sm: 24, md: 24, lg: 8, xl: 8 },
  wrapperCol: { sm: 24, md: 24, lg: 16, xl: 16 }
};

interface Props{
  isLoading?: boolean,
  required?: boolean | true;
  statusAccount?: string | undefined;
  setStatusAccount?: any;
};

const Account = ({ isLoading, required, statusAccount, setStatusAccount }: Props) => {
  return (
    <>
      <Row align={'middle'}>
        <Col span={8}>
          <h6 style={{ marginBottom: 20 }}>Thiết lập tài khoản:</h6>
        </Col>
        <Col span={4}>
        <Form.Item
          name="updateAccount">
          <Switch
              checked={statusAccount === 'ACTIVE'}
              onChange={(value) => setStatusAccount(value ? 'ACTIVE' : 'INACTIVE')}
              // unCheckedChildren='Cập nhật'
              // checkedChildren='Không cập nhật'
          />
        </Form.Item>
        </Col>
      </Row>
      <Row gutter={48} align="middle" justify="space-between">
        <Col span={24}>
          <Form.Item
            name="username"
            labelAlign='left'
            label={<Tooltip
              placement='topLeft'
              zIndex={2001}
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
                <Input disabled autoComplete="off"/>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        <Col span={24}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            labelAlign='left'
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
              <Input.Password disabled = {statusAccount === 'INACTIVE'} autoComplete="off" />
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            dependencies={['password']}
            {...formItemLayoutLong}
            labelAlign='left'
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
            labelCol={{span : 6}}
            wrapperCol={{span : 18}}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Input.Password style={{width : '100%'}} disabled = {statusAccount === 'INACTIVE'} autoComplete="new-password" />
            )}
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default Account;
