import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useMemo, useState } from "react";
import { get, map, reduce, truncate } from "lodash";
import apis from "../reportOverview.api";
import { useFetchState } from "~/utils/hook";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  FILTER_BY_VI,
  TYPE_REPORT_VI,
  checkKeyContainsGroupByRangerDate,
  getReportProductbody,
  renderOptionReport,
  renderOptionReportB2C,
} from "../reportOverview.modal";
import { filterSelectWithLabel, formatter } from "~/utils/helpers";
import dayjs from "dayjs";
import SelectPharmacy from "~/modules/sale/bill/components/SelectPharmacy";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import SelectProductBySupplier from "~/modules/product/components/SelectProductBySupplier";
import SelectArea from "./SelectArea";
import subvn from "~/core/subvn";
import DetailData from "./DetailData";
import { useUpdateReportProductSupplierParams } from "../reportOverview.hook";
import SelectEmployeeV2 from "~/modules/employee/components/SelectEmployeeV2";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

interface propsType {
  query?: any;
  spaceType?: any;
}

const rangerTimeDef = "WEEKLY";

export default function ReportChart(
  props: Partial<propsType>
): React.JSX.Element {
  const { query, spaceType } = props;
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateReportProductSupplierParams(query);
  const [form] = Form.useForm();
  const [formSaleChannel] = Form.useForm();
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [detail, setDetail] = useState<any>(null);
  const cities = subvn.getProvinces();
  const areas = useMemo(() => subvn.getAreas(), []);
  const memoQuery = useMemo(
    () => ({
      api: apis.getListChart,
      query: query,
      useDocs: false,
      required: ["dataType"] as (keyof getReportProductbody)[],
      ...date,
    }),
    [query, date]
  );
  const [dataReport, isLoading] = useFetchState(memoQuery);

  useEffect(() => {
    onParamChange({
      spaceType: spaceType,
      dataType: "groupProduct",
      rangerTime: date.map((time) => time.format("YYYY-MM-DD")).join(","),
      rangerType: rangerTimeDef,
    });
  }, []);

  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);

  const keyInData = useMemo(() => {
    if (dataReport) {
      setDetail(dataReport?.info);
      return reduce(
        dataReport?.data,
        (result: string[], current: { [key: string]: unknown }) => {
          const listKey: string[] = Object.keys(current).filter(
            (el) => el !== "_id"
          );
          listKey.map((key: string) => {
            if (!result.includes(key)) {
              result.push(key);
            }
          });
          return result;
        },
        [] as Array<string>
      );
    }
    return [];
  }, [dataReport]);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [id, setId] = useState<any>(null);

  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpenForm(true);
  };
  const onCloseForm = () => {
    setId(null);
    setIsOpenForm(false);
  };
  const optionsDate = useMemo(
    () =>
      Object.entries(FILTER_BY_VI)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [FILTER_BY_VI]
  );
  return (
    <div>
      <Row style={{ marginBottom: 20 }} justify={"space-around"}>
        <Col span={8}>
          <Space>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Tiêu chí:
            </Typography>
            <Select
              loading={isLoading}
              defaultValue={"groupProduct"}
              options={
                spaceType !== "partner"
                  ? renderOptionReport
                  : renderOptionReportB2C
              }
              popupMatchSelectWidth={false}
              filterOption={filterSelectWithLabel}
              onChange={(value) => onParamChange({ dataType: value || null })}
              style={{ minWidth: 200 }}
            ></Select>
          </Space>
        </Col>
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
                // setDate(P);
              }}
            />
          </Space>
        </Col>
        <Col span={8}>
          {checkKeyContainsGroupByRangerDate(query?.dataType ?? "") === true ? (
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
          ) : (
            <></>
          )}
          <Button type="primary" onClick={() => onOpenForm()}>
            Chi tiết
          </Button>
        </Col>
      </Row>
      <Row
        justify="space-between"
        gutter={[16, 24]}
        style={{ marginLeft: 2, marginRight: 2 }}
      >
        <Col span={6}>
          <Form
            form={formSaleChannel}
            initialValues={{ salesChannelId: query?.salesChannelId }}
          >
            <SelectSaleChannel
              validateFirst={false}
              form={formSaleChannel}
              style={{ width: 200 }}
              showIcon={false}
              size={"middle"}
              defaultValue={query?.salesChannelId || null}
              divisionText={spaceType !== "partner" ? "B2B" : "B2C"}
              onChange={(value) => onParamChange({ salesChannelId: value })}
              mode="multiple"
            />
          </Form>
        </Col>
        <Col span={6}>
          <SelectArea
            data={areas}
            placeholder="Miền"
            value={query?.areaId ? query?.areaId?.split(",") : []}
            onChange={(value) => onParamChange({ areaId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
        <Col span={6}>
          <SelectArea
            data={cities}
            placeholder="Tỉnh"
            value={query?.cityId ? query?.cityId?.split(",") : []}
            onChange={(value) => onParamChange({ cityId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
      </Row>
      <Row
        justify="space-between"
        gutter={[16, 24]}
        style={{ marginLeft: 2, marginRight: 2, marginTop: 20 }}
      >
        <Col span={6}>
          <SelectSupplier
            value={query?.supplierId ? query?.supplierId?.split(",") : []}
            onChange={(value) => onParamChange({ supplierId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
        {spaceType !== "partner" ? (
          <Col span={6}>
            <Form form={form} initialValues={{ employeeId: query?.salerId }}>
              <SelectEmployeeV2
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                size={"middle"}
                defaultValue={query?.salerId || null}
                onChange={(value) => onParamChange({ salerId: value })}
                mode="multiple"
              />
            </Form>
          </Col>
        ) : (
          <></>
        )}
        <Col span={6}>
          {spaceType !== "partner" ? (
            <Form form={form} initialValues={{ pharmacyId: query?.customerId }}>
              <SelectPharmacy
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                required={false}
                size={"middle"}
                defaultValue={query?.customerId || null}
                onChange={(value) => onParamChange({ customerId: value })}
                mode="multiple"
                showButtonAdd={false}
              />
            </Form>
          ) : (
            <SelectCollaborator
              value={query?.customerId ? query?.customerId?.split(",") : []}
              onChange={(value) => onParamChange({ customerId: value || null })}
              style={{ width: 200 }}
              mode="multiple"
            />
          )}
        </Col>
        <Col span={6}>
          <Form form={form} initialValues={{ productId: query?.productId }}>
            <SelectProductBySupplier
              validateFirst={false}
              form={form}
              style={{ width: 200 }}
              showIcon={false}
              size={"middle"}
              defaultValue={query?.productId || null}
              onChange={(value) => onParamChange({ productId: value })}
              mode="multiple"
            />
          </Form>
        </Col>
      </Row>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ width: "100%", height: "80%" }}>
          <ResponsiveBar
            data={dataReport?.data ?? []}
            keys={keyInData}
            indexBy="_id"
            margin={{ top: 20, right: 20, bottom: 40, left: 100 }}
            padding={
              checkKeyContainsGroupByRangerDate(query?.dataType ?? "")
                ? 0.1
                : 0.5
            }
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "red_yellow_blue" }}
            enableTotals={true}
            valueFormat={(value?: any) => formatter(value)}
            groupMode={
              checkKeyContainsGroupByRangerDate(query?.dataType ?? "")
                ? "grouped"
                : "stacked"
            }
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "fries",
                },
                id: "dots",
              },
              {
                match: {
                  id: "sandwich",
                },
                id: "lines",
              },
            ]}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            label={(key) => {
              return Number(key.value).toLocaleString("vi");
            }}
            tooltip={(e) => {
              return (
                <Typography.Text
                  style={{
                    backgroundColor: "white",
                    padding: "6px 10px",
                    border: "0.2px solid #333",
                    borderRadius: 6,
                  }}
                >
                  <Tag bordered={true} color={e.color}>
                    <span style={{ color: e.color }}>.</span>
                  </Tag>
                  {get(detail, [e.id], e.id) +
                    ": " +
                    Number(e.value).toLocaleString("vi")}
                </Typography.Text>
              );
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -30,
              legend: `Biểu đồ thống kê`,
              legendPosition: "middle",
              legendOffset: 72,
              // truncateTickAt: 10,
              format: (value) =>
                truncate(get(detail, [value], value), {
                  length: 10,
                }),
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: -40,
              truncateTickAt: 0,
              format: (v) => Number(v).toLocaleString("vi"),
            }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[]}
            role="application"
          />
        </div>
      </div>
      <Modal
        width={900}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <DetailData onParamChange={onParamChange} />
      </Modal>
    </div>
  );
}
