import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { BellFilled, BellOutlined } from '@ant-design/icons';
import { Badge, Divider } from 'antd';
import { debounce, keys } from 'lodash';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { useChangeStatusNotification, useCountUnreadMyNotification, useDeleteNotification, useMergeInitNotifications, useMyNotifications } from '../notification.hook';
import { useOnMessageNewWhBillFirebase } from '../firebase/broadCastChanel/firebaseChanel';
import { PATH_APP } from '~/routes/allPath';
import GroupButtonNotify from '../components/GroupButton';
import SkeletonList from '~/components/common/SkeletonList';
import NotificationItem from '../components/NotificationItem';
import '../notification.style.scss'
import { notificationSliceActions } from '../redux/reducer';

const NotificationDropdown = (props: any) => {
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState(null);
  const [inputValue, setInputValue] = useState([null, null]);
  const {pathname } = useLocation();
  const dispatch = useDispatch();

  const startDate = dayjs(inputValue[0]).isValid()
    ? dayjs(inputValue[0]).format('YYYY-MM-DD')
    : null;
  const endDate = dayjs(inputValue[1]).isValid()
    ? dayjs(inputValue[1]).format('YYYY-MM-DD')
    : null;

  const query = useMemo(
    () => ({
      page: 1,
      limit: 10,
      status,
      startDate,
      endDate
    }),
    [status, startDate, endDate]
  );

  const [MyNotifications, isLoading] = useMyNotifications(query);
  const notifications = useMergeInitNotifications(MyNotifications)
  console.log(notifications,'notifications')
  const countUnread = useCountUnreadMyNotification();
  // const [setNewBill] = useSetNewBill();
  const triggerRefresh = () => {
    dispatch(notificationSliceActions.getNotificationRequest(query as any));
    // setNewBill(true)
  };
  useOnMessageNewWhBillFirebase(debounce(triggerRefresh, 800));
  const [isSubmitLoading, updateStatus] = useChangeStatusNotification();
  return (
    <>
      <Dropdown
        isOpen={menu}
        toggle={() => {}}
        className="dropdown d-inline-block"
        tag="li"
        style={{ marginRight: 10, maxHeight: 500 }}
      >
        <DropdownToggle
          onClick={() => {
            if (pathname === PATH_APP.myNotification.root) return;
            setMenu(!menu);
          }}
          className="btn header-item noti-icon waves-effect"
          tag="button"
          id="page-header-notifications-dropdown"
          style={{ width: 60, zIndex: 2000, paddingTop: 15}}
        >
          {pathname === PATH_APP.myNotification.root ? (
            <BellFilled
              style={{
                color: '#3D7FF3',
                backgroundColor: '#EAF5FF',
                fontSize: 22,
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            />
          ) : (
            <Badge overflowCount={99} size="small" count={countUnread}>
              <BellOutlined
                style={{
                    color: 'white',
                    fontSize: 22,
                }}
              />
              </Badge>
          )}
        </DropdownToggle>

        <DropdownMenu style={{zIndex:999,width: 360}} className="dropdown-menu-lg dropdown-menu-end p-0 z">
          <div className="p-3">
            <Row align='middle' justify='space-between'>
              <Col>
                <h6 className="m-0 font-size-16"> Thông báo </h6>
              </Col>
            </Row>
          </div>
          <GroupButtonNotify status={status} setStatus={setStatus}  setInputValue={setInputValue}
              inputValue={inputValue} />
          <div style={{ height: "400px",minHeight: "400px", maxHeight: "400px", overflow: 'hidden', overflowY: 'scroll' }}>
            {isLoading
              ? <SkeletonList rowCount={9} />
              : keys(notifications)?.map((date, index) => <React.Fragment key={date}>
                <Divider orientation="left" orientationMargin="10"
                  style={{ margin: 0, position: 'sticky', zIndex: index + 1, backgroundColor: 'white', top: 0 }}
                >
                  {date}
                </Divider>
                {notifications?.[date]?.map((notification: any) => <NotificationItem updateStatus={updateStatus} onClickItem={debounce(triggerRefresh, 800)} data={notification} />)}
              </React.Fragment>)}
          </div>

          <div className="p-2 border-top d-grid z-3">
            <Link
              className="btn btn-sm btn-link font-size-14 text-center"
              to={PATH_APP.myNotification.root}
            >
              <i className="uil-arrow-circle-right me-1"></i>{' '}
              Xem tất cả
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;
