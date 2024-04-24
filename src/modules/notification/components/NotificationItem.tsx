import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { vietnamMoment } from '~/utils/helpers';
import dayjs from 'dayjs';
import { STATUS_READ, TYPE_NOTIFICATION_ICON } from '../notification.modal';
import { MenuProps } from 'antd/lib';
import '../notification.style.scss'

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
      console.log(status,'statusstatus')
      // updateStatus({ id: get(data, '_id'), status: STATUS_READ.read });
    }
    if (onClickItem && typeof onClickItem === 'function') {
      onClickItem();
    }
  };

  const onChangeStatus = (status: string) => {
    console.log(status,'status')
    // updateStatus({ id: get(data, '_id'), status });
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
