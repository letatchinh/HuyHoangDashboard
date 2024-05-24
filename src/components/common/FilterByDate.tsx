import { Col, DatePicker, Row, Select, Space, Typography } from "antd";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FILTER_BY_VI } from "~/constants/defaultValue";
import { filterSelectWithLabel } from "~/utils/helpers";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const rangerTimeDef = "WEEKLY";
type propsType = {
  onParamChange?: any;
  query?: any;
  isLoading?: boolean;
};
export default function FilterByDate(props: propsType): React.JSX.Element {
  const { onParamChange, query, isLoading } = props;
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);

  const optionsDate = useMemo(
    () =>
      Object.entries(FILTER_BY_VI)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [FILTER_BY_VI]
  );

  return (
    <Col>
      <Row>
        <Col span={8}>
          <Space>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Thời gian:
            </Typography>
            <RangePicker
              format={dateFormat}
              allowEmpty={[false, false]}
              value={[
                date[0] ? dayjs(date[0]) : null,
                date[1] ? dayjs(date[1]) : null,
              ]}
              onChange={(value) => {
                const P =
                  [
                    dayjs(value?.[0] ?? dayjs().startOf("month").valueOf()),
                    dayjs(value?.[1]),
                  ] ?? dayjs().endOf("month").valueOf();
                onParamChange({
                  rangerTime: P.map((e) => e.format("YYYY-MM-DD")),
                });
              }}
            />
          </Space>
        </Col>
        <Col span={8}>
          <Select
            loading={isLoading}
            defaultValue={"WEEKLY"}
            options={optionsDate}
            allowClear
            style={{ minWidth: 200, marginRight: "10%" }}
            popupMatchSelectWidth={false}
            filterOption={filterSelectWithLabel}
            onChange={(value) => onParamChange({ rangerType: value || null })}
          ></Select>
        </Col>
      </Row>
    </Col>
  );
}
