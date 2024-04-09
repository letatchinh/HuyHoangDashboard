// import React, { useState, useMemo } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Badge, Divider, Dropdown, Menu, Row, Col } from 'antd';
// import { BellFilled, BellOutlined } from '@ant-design/icons';
// import { debounce, keys } from 'lodash';
// import { withTranslation, WithTranslation } from 'react-i18next';
// import { PATH_APP } from '~/routes/allPath';
// import dayjs from 'dayjs';
// import { useDispatch } from 'react-redux';
// import GroupButtonNotify from '../components/GroupButton';
// import SimpleBar from 'simplebar-react';
// import NotificationItem from '../components/NotificationItem';

// interface NotificationDropdownProps extends WithTranslation {}

// const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ t }) => {
//   const [menu, setMenu] = useState<boolean>(false);
//   const [status, setStatus] = useState<string | null>(null);
//   const [inputValue, setInputValue] = useState([null, null]);
//     const { pathname } = useLocation();
// //   const [setNewBill] = useSetNewBill();
//   const dispatch = useDispatch();

//   const startDate = useMemo(() => (dayjs(inputValue[0]).isValid() ? dayjs(inputValue[0]).format('YYYY-MM-DD') : null), [
//     inputValue,
//   ]);
//   const endDate = useMemo(() => (dayjs(inputValue[1]).isValid() ? dayjs(inputValue[1]).format('YYYY-MM-DD') : null), [
//     inputValue,
//   ]);

//   const query = useMemo(
//     () => ({
//       page: 1,
//       limit: 10,
//       status,
//       startDate,
//       endDate,
//     }),
//     [status, startDate, endDate]
//   );

// //   const [MyNotifications, isLoading] = useMyNotifications(query);
// //   const notifications = useMergeInitNotifications(MyNotifications);
// //   const countUnread = useCountUnreadMyNotification();
//   const triggerRefresh = () => {
//     // dispatch(getMyNotifications(query));
//     // setNewBill(true);
//   };
// //   useOnMessageNewWhBillFirebase(debounce(triggerRefresh, 800));
// //   const [, updateStatus] = useChangeStatusNotification();

//   return (
//     <>
//       <Dropdown
//         visible={menu}
//         onVisibleChange={(visible) => {
//           if (pathname === PATH_APP.myNotification.root) return;
//           setMenu(visible);
//         }}
//         overlayStyle={{ zIndex: 1601, width: 360 }}
//         className="dropdown d-inline-block"
//         trigger={['click']}
//       >
//         <Badge overflowCount={99} size="small" count={countUnread}>
//           <BellOutlined
//             className="btn header-item noti-icon waves-effect"
//             id="page-header-notifications-dropdown"
//             style={{ width: 60, color: 'white', fontSize: 22 }}
//           />
//         </Badge>

//         <Menu className="dropdown-menu-lg dropdown-menu-end p-0 z">
//           <div className="p-3">
//             <Row align='middle' justify='space-between'>
//               <Col>
//                 <h6 className="m-0 font-size-16"> {t('Thông báo')} </h6>
//               </Col>
//             </Row>
//           </div>
//           <GroupButtonNotify status={status} setStatus={setStatus} setInputValue={setInputValue} inputValue={inputValue} />
//           <SimpleBar style={{ height: "400px" }}>
//             {isLoading
//               ? <SkeletonList rowCount={10} />
//               : keys(notifications)?.map((date, index) => <React.Fragment key={date}>
//                 <Divider orientation="left" orientationMargin="0"
//                   style={{ margin: 0, position: 'sticky', zIndex: index + 1, backgroundColor: 'white', top: 0 }}
//                 >
//                   {date}
//                 </Divider>
//                 {notifications?.[date]?.map((not: any) => <NotificationItem updateStatus={updateStatus} onClickItem={debounce(triggerRefresh, 800)} data={not} key={not._id} />)}
//               </React.Fragment>)}
//           </SimpleBar>

//           <div className="p-2 border-top d-grid">
//             <Link
//               className="btn btn-sm btn-link font-size-14 text-center"
//               to={PATH_APP.myNotification.root}
//             >
//               <i className="uil-arrow-circle-right me-1"></i>{' '}
//               {t('Xem tất cả')}{' '}
//             </Link>
//           </div>
//         </Menu>
//       </Dropdown>
//     </>
//   );
// };

// export default withTranslation()(NotificationDropdown);
