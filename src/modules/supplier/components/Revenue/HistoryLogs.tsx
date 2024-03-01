import React from "react";
import { Col, List, Row, Typography } from "antd";
import { clone, get } from "lodash";
import dayjs from "dayjs";
interface propsType {
  historyLogs: any;
}
export default function HistoryLogs({ historyLogs }: propsType) {
  return (
    <div
      className="history-logs-wrap"
      style={{ marginTop: "1rem",marginBottom: "1rem", overflow: "scroll", maxHeight: "500px" , backgroundColor: "#fff", padding: 10 }}
    >
      <List
        header={<h2>Logs</h2>}
        bordered
        dataSource={clone(historyLogs) || []}
        renderItem={(item: any) => (
          <List.Item>
            <Row
              className="history-log-item"
              wrap={false}
              gutter={40}
              style={{ marginTop: "10px" }}
              key={item._id}
            >
              <Col>
                <span>
                  <Typography.Text mark>
                    {dayjs(item.timestamp).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </span>
              </Col>
              <Col>
                <span>{get(item, 'fullName', '')}</span>
              </Col>
              <Col>
                <span>{item?.message}</span>
              </Col>
            </Row>
          </List.Item>
        )}
      ></List>
    </div>
  );
}
