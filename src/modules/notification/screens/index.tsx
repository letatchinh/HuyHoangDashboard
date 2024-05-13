import WhiteBox from "~/components/common/WhiteBox";
import "../notification.style.scss";
import Breadcrumb from "~/components/common/Breadcrumb";
import { Col, Dropdown, List, Menu, Row } from "antd";
import GroupButtonNotify from "../components/GroupButton";
import { CheckOutlined, EllipsisOutlined } from "@ant-design/icons";
import SkeletonList from "~/components/common/SkeletonList";
import NotificationItem from "../components/NotificationItem";
import { debounce, get } from "lodash";
import { useDispatch } from "react-redux";
import {
  useChangeManyStatusNotification,
  useChangeStatusNotification,
  useMyNotifications,
  useNotificationPaging,
  useNotificationQueryParams,
  useUpdateNotificationParams,
} from "../notification.hook";
import { notificationSliceActions } from "../redux/reducer";
import { useOnMessageNewWhBillFirebase } from "../firebase/broadCastChanel/firebaseChanel";
import { STATUS_READ } from "../constants";
import { MenuProps } from "antd/lib";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

const NotificationScreen = (props: any) => {
  const dispatch = useDispatch();
  const [query] = useNotificationQueryParams();
  const [inputValue, setInputValue] = useState([null, null]);

  const [MyNotifications, isLoading] = useMyNotifications(query);
  const [, { onParamChange }] = useUpdateNotificationParams(query);
  const paging = useNotificationPaging();
  const triggerRefresh = () => {
    dispatch(notificationSliceActions.getNotificationRequest(query as any));
  };

  useOnMessageNewWhBillFirebase(debounce(triggerRefresh, 800));

  const [, updateStatus] = useChangeStatusNotification();
  const [, updateMany] = useChangeManyStatusNotification();

  const onUpdateCurrentPage = () => {
    const notificationUnread = MyNotifications?.filter(
      (notification: any) => get(notification, "status") === STATUS_READ.unread
    );
    if (!!notificationUnread && notificationUnread?.length) {
      let ids = notificationUnread?.map((i: any) => get(i, "_id"))?.join(",");
      updateMany({ ids, status: STATUS_READ.read });
    };
  };

  const items: MenuProps["items"] = [
    {
      key: uuidv4(),
      label: (
        // <Menu className='notification-item--actionGroup__menu'>
        <Menu.Item
          key="0"
          onClick={onUpdateCurrentPage}
          icon={<CheckOutlined />}
        >
          <span>Đánh dấu trang hiện tại là đã đọc</span>
        </Menu.Item>
        // </Menu>
      ),
    },
  ];

  return (
    <WhiteBox>
      <Breadcrumb title="Thông báo của tôi" />
      <div className="notification-wrapper">
        <div
          className="notification-wrapper__content"
          style={{ width: "50%", margin: "auto" }}
        >
          <Row justify="space-between">
            <Col>
              <GroupButtonNotify
                status={get(query, "status")}
                setInputValue={setInputValue}
                inputValue={inputValue}
                setStatus={(stt: any) =>{
                  onParamChange({ ...query, status: stt })
                  }
                }
              />
            </Col>
            <Col>
              <Dropdown
                className="mx-auto dropdown-notification-actionGroup"
                menu={{ items }}
                trigger={["click"]}
              >
                <div className="notification-item--actionGroup__btn">
                  <EllipsisOutlined style={{ fontSize: 18 }} />
                </div>
              </Dropdown>
            </Col>
          </Row>
          {isLoading ? (
            <SkeletonList rowCount={10} />
          ) : (
            <List
              style={{ border: "none" }}
              className="list-custom--hover"
              bordered
              loading={false}
              pagination={{
                position: "bottom",
                align: "center",
                ...paging,
                onChange: (current, pageSize) => {
                  onParamChange({ page: current, limit: pageSize });
                },
              }}
            >
              {MyNotifications?.map((item: any, index: number) => (
                <NotificationItem
                  updateStatus={updateStatus}
                  onClickItem={debounce(triggerRefresh, 800)}
                  data={item}
                  key={index}
                />
              ))}
            </List>
          )}
        </div>
      </div>
    </WhiteBox>
  );
};
export default NotificationScreen;
