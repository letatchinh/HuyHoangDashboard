import { CheckOutlined, CloseOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { MenuProps } from 'antd/lib';
import { get } from 'lodash';
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { daysAgo } from '~/utils/helpers';
import { STATUS_READ, TYPE_NOTIFICATION, TYPE_NOTIFICATION_ICON, typeNotification } from '../constants';
import '../notification.style.scss';
interface NotificationItemProps {
  data: {
    createdAt: string;
    status: string;
    url: string;
    content: string;
    type: string;
    _id: string; // assuming _id is a string
  };
  onClickItem?: () => void;
  updateStatus: (statusObj: { id: string; status: string }) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ data, onClickItem, updateStatus }) => {
  const { createdAt, status, url, content, type } = data;
  const isRead = useMemo(() => STATUS_READ.read === status, [status]);

  const navigateUrl = () => {
    if (status === STATUS_READ.unread) {
      updateStatus({ id: get(data, '_id'), status: STATUS_READ.read });
    };
    if (onClickItem && typeof onClickItem === 'function') {
      onClickItem();
    };
  };

  const onChangeStatus = (status: string) => {
    updateStatus({ id: get(data, '_id'), status });
  };

  const renderIcon = (type: string) => {
    if (TYPE_NOTIFICATION.ORDER_CONVERT_QUOTATION_CUSTOMER === type) {
      return <i className='uil-shopping-basket'></i>
    };
    if (TYPE_NOTIFICATION.ORDER_QUOTATION_CUSTOMER === type) {
      return <i className='uil-shopping-basket'></i>
    };
    if (TYPE_NOTIFICATION.ORDER_SUPPLIER === type) {
      return <i className='uil-shopping-basket'></i>
    };
  };

  const items: MenuProps['items'] = [
    {
      key: uuidv4(),
      label: (
        isRead ?
          <Button icon={<CloseOutlined />} onClick={() => onChangeStatus(STATUS_READ.unread)} type='text' >Đánh dấu chưa đọc</Button>
          : <Button icon={<CheckOutlined />} onClick={() => onChangeStatus(STATUS_READ.read)} type='text' >Đánh dấu đã đọc</Button>
      ),
    },
  ];
  return (
    <Dropdown
      menu={{items}}
      trigger={['contextMenu']}
    >
      <Link to={url} onClick={navigateUrl} className='text-reset notification-item'  style={{textDecoration: 'none'}}>
        <div className='d-flex align-items-start'>
          <div className='avatar-xs me-3'>
            {/* <span className='avatar-title bg-primary rounded-circle font-size-16'> */}
            <ShoppingOutlined/>
            {/* </span> */}
          </div>
          <div className={`flex-1`}>
            <h6 style={{fontSize: '0.9rem'}} className={`mt-0 mb-1 ${isRead ? 'text-muted' : ''}`}>{content}</h6>
            <div className={`font-size-12 ${isRead ? 'text-muted' : 'text-primary fw-bold'}`}>
              <p style={{fontSize: '0.8rem'}} className='mb-0'>
                <i className='mdi mdi-clock-outline'></i> {daysAgo(createdAt)}
              </p>
            </div>
          </div>
          <div className='notification-item--action d-flex align-items-center justify-content-center'>
            {!isRead && <span className='notification-item--action__circleBlue'></span>}
          </div>
        </div>
        <hr style={{ margin: 0 }} />
      </Link>
    </Dropdown>
  );
};

export default memo(NotificationItem);
