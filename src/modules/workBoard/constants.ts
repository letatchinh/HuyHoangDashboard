  import React from 'react';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
} from 'antd';
import { BOARD_SECURITY_TYPE } from "./workBoard.modal";
import { CloseOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
export const BOARD_SECURITY:BOARD_SECURITY_TYPE = {
    public:'Công khai',
    private:'Riêng tư',
  }




