import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { vietnamMoment } from '~/utils/helpers';
import dayjs from 'dayjs';
import { STATUS_READ, TYPE_NOTIFICATION_ICON } from '../notification.modal';

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
    }
    if (onClickItem && typeof onClickItem === 'function') {
      onClickItem();
    }
  };

  const onChangeStatus = (status: string) => {
    updateStatus({ id: get(data, '_id'), status });
  };

  return (
    <Dropdown
      overlay={
        <Menu className='notification-item--actionGroup__menu'>
          {isRead ? (
            <Menu.Item key={uuidv4()} onClick={() => onChangeStatus(STATUS_READ.unread)} icon={<CloseOutlined />}>
              <span>Đánh dấu chưa đọc</span>
            </Menu.Item>
          ) : (
            <Menu.Item key={uuidv4()} onClick={() => onChangeStatus(STATUS_READ.read)} icon={<CheckOutlined />}>
              <span>Đánh dấu đã đọc</span>
            </Menu.Item>
          )}
        </Menu>
      }
      trigger={['contextMenu']}
    >
      <Link to={url} onClick={navigateUrl} className='text-reset notification-item'>
        <div className='d-flex align-items-start'>
          <div className='avatar-xs me-3'>
            <span className='avatar-title bg-primary rounded-circle font-size-16'>
              {TYPE_NOTIFICATION_ICON[type] ?? <i className='uil-shopping-basket'></i>}
            </span>
          </div>
          <div className={`flex-1`}>
            <h6 className={`mt-0 mb-1 ${isRead ? 'text-muted' : ''}`}>{content}</h6>
            <div className={`font-size-12 ${isRead ? 'text-muted' : 'text-primary fw-bold'}`}>
              <p className='mb-0'>
                <i className='mdi mdi-clock-outline'></i> {dayjs(vietnamMoment(createdAt), 'YYYYMMDD').fromNow()}
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
