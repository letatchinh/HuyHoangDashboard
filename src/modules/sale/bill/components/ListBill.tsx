import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  redirectRouterBillId,
  useBillPaging,
  useBillQueryParams,
  useGetBills,
  useUpdateBillParams,
} from "../bill.hook";

import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Tooltip,
  TreeSelect,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { Link, useLocation } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import {
  concatAddress,
  formatter,
  getExistProp,
  pagingTable,
  permissionConvert,
} from "~/utils/helpers";
import { STATUS_BILL_VI } from "../constants";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import useCheckBoxExport from "~/modules/export/export.hook";
import WithPermission from "~/components/common/WithPermission";
import ExportExcelButton from "~/modules/export/component";
import { CalculateBill } from "../bill.service";
import DateTimeTable from "~/components/common/DateTimeTable";
import SelectEmployee from "~/modules/employee/components/SelectSearch";
import { REF_COLLECTION } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import { useIsAdapterSystem } from "~/utils/hook";
import SelectPharmacy from "./SelectPharmacy";
import { FormFieldSearch } from "../bill.modal";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
import GeoTreeSelect from "~/modules/geo/components/GeoTreeSelect";
import { RELATIVE_POSITION } from "~/modules/geo/constants";
import SelectEmployeeV2 from "~/modules/employee/components/SelectEmployeeV2";
const CalculateBillMethod = new CalculateBill();
type propsType = {
  status?: string;
};
const defaultDate = {
  startDate: dayjs().startOf("month"),
  endDate: dayjs().endOf("month"),
};
const { Option } = Select;
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
  const [query] = useBillQueryParams(status);

  const [keyword, { setKeyword, onParamChange }] = useUpdateBillParams(query);
  const [bills, isLoading] = useGetBills(query);
  const paging = useBillPaging();
  const isSystem = useIsAdapterSystem();
  //Download
  const onPermissionCovert = useCallback(permissionConvert(query), [query]);
  const canDownload = useMatchPolicy(onPermissionCovert("DOWNLOAD", "BILL"));
  const { pathname } = useLocation();
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const [form] = Form.useForm();
  const initValue = useMemo(() => {
    const root = {
      ...query,
      startDate: query?.startDate ? dayjs(query?.startDate) : null,
      endDate: query?.endDate ? dayjs(query?.endDate) : null,
      managementArea: query?.managementArea?.split(","),
      pharmacyId: query?.pharmacyIds,
    };
    return getExistProp(root);
  }, [query]);

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: <p style={{ color: "#333", fontWeight: "bold" }}>Mã đơn hàng</p>,
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        width: 150,
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={redirectRouterBillId(pathname) + "/" + get(record, "_id")}
            >
              {codeSequence}
            </Link>
          );
        },
      },
      // {
      //   title: "Ngày tạo đơn",
      //   dataIndex: "createdAt",
      //   key: "createdAt",
      //   align: "left",
      //   width: 150,
      //   render(createdAt, record, index) {
      //     return (<DateTimeTable data={createdAt} />);
      //   },
      // },
      {
        title: "Ngày cập nhật",
        dataIndex: "dateToStatus",
        key: "dateToStatus",
        align: "left",
        width: 150,
        render(dateToStatus, record, index) {
          return ( <DateTimeTable data={dateToStatus} />
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "left",
        width: 250,
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 150,
        render(status, record, index) {
          return (
            <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
          );
        },
      },
      {
        title: "Giá trị đơn hàng",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        width: 150,
        render(totalPrice, record, index) {
          return <Typography.Text>{formatter(totalPrice)}</Typography.Text>;
        },
      },
      {
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
        align: "left",
        width: 180,
        render(cancelNote?: any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: cancelNote,
                rows: 2,
              }}
            >
              {cancelNote}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        align: "left",
        width: 180,
        render(note?: any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: note,
                rows: 2,
              }}
            >
              {note}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        align: "center",
        width: 180,
        render(pair, record, index) {
          return (
            <Typography.Text>
              {formatter(pair + get(record, "totalReceiptVoucherCompleted"))}
            </Typography.Text>
          );
        },
      },      
      {
        title: "Khách phải trả",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        width: 180,
        render(totalPrice, record, index) {
          const remainAmount = CalculateBillMethod.remainAmount(record);
          return <Typography.Text>{formatter(remainAmount)}</Typography.Text>;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "deliveryAddressId",
        key: "deliveryAddressId",
        width: 350,
        render(value, record, index) {
          return concatAddress(value);
        },
      },
      ...(canDownload
        ? [
            {
              title: "Lựa chọn",
              key: "_id",
              width: 80,
              align: "center" as any,
              fixed: "right" as any,
              render: (item: any, record: any) => {
                const id = record?._id;
                return (
                  <Checkbox
                    checked={arrCheckBox?.includes(id)}
                    onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                  />
                );
              },
            },
          ]
        : []),
    ],
    [arrCheckBox, canDownload]
  );

  useEffect(() => {
    const root = {
      ...query,
      startDate: query?.startDate ? dayjs(query?.startDate) : null,
      endDate: query?.endDate ? dayjs(query?.endDate) : null,
      managementArea: query?.managementArea?.split(","),
    };
    form.setFieldsValue(getExistProp(root));
  }, []);

  const onValuesChange = (valueChange: any) => {
    const key = Object.keys(valueChange)[0];

    switch (key) {
      case "startDate":
        onParamChange({
          startDate: valueChange?.startDate
            ? dayjs(valueChange?.startDate).format("YYYY-MM-DD")
            : null,
        });
        break;
      case "endDate":
        onParamChange({
          endDate: valueChange?.endDate
            ? dayjs(valueChange?.endDate).format("YYYY-MM-DD")
            : null,
        });
        break;

      default:
        onParamChange({ ...valueChange });
        break;
    }
  };
  return (
    <div className="bill-page">
      <Row justify={"space-between"}>
        <Col span={12}>
          <Space style={{ alignItems: "normal" }}>
            <SelectSupplier
              value={query?.supplierIds ? query?.supplierIds?.split(",") : []}
              onChange={(value) =>
                onParamChange({ supplierIds: value?.length ? value : null })
              }
              mode="multiple"
              style={{ width: 250 }}
            />
            {isSystem &&
            query.refCollection !== REF_COLLECTION.PHARMA_PROFILE &&
            query.refCollection ? (
              query.refCollection === REF_COLLECTION.EMPLOYEE ? (
                <Form
                  form={form}
                  initialValues={{ employeeId: query?.employeeIds }}
                >
                  <SelectEmployeeV2
                    validateFirst={false}
                    form={form}
                    style={{ width: 200 }}
                    showIcon={false}
                    size={"middle"}
                    defaultValue={query?.employeeIds || null}
                    onChange={(value) => onParamChange({ employeeIds: value })}
                    mode="multiple"
                  />
                </Form>
              ) : (
                <SelectCollaborator
                  value={query?.partnerIds ? query?.partnerIds?.split(",") : []}
                  onChange={(value) =>
                    onParamChange({ partnerIds: value?.length ? value : null })
                  }
                  mode="multiple"
                  style={{ width: 200 }}
                />
              )
            ) : (
              <Form form={form} initialValues={initValue}>
                <SelectPharmacy
                  validateFirst={false}
                  form={form}
                  style={{ width: 200 }}
                  showIcon={false}
                  required={false}
                  size={"middle"}
                  defaultValue={query?.pharmacyIds || null}
                  onChange={(value) =>
                    onParamChange({ pharmacyIds: value?.length ? value : null })
                  }
                  mode="multiple"
                />
              </Form>
            )}
            <SearchAnt
              style={{ alignSelf: "center" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
            />
          </Space>
        </Col>
        <WithPermission permission={onPermissionCovert("DOWNLOAD", "BILL")}>
          <Col>
            <ExportExcelButton
              api="bill"
              exportOption="bill"
              query={query}
              fileName="Danh sách đơn hàng"
              ids={arrCheckBox}
            />
          </Col>
        </WithPermission>
      </Row>
      <Row justify={"space-between"}>
        <Form
          form={form}
          style={{ width: "100%" }}
          initialValues={{
            ...query,
            managementArea: query?.managementArea?.split(","),
            startDate: dayjs.isDayjs(query?.startDate) && dayjs(query?.startDate),
            endDate: dayjs.isDayjs(query?.endDate) && dayjs(query?.endDate),
          }}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16} align="middle" justify="space-between">
            <Col span={8}>
              <Form.Item<FormFieldSearch>
                name={"startDate"}
                label="Ngày bắt đầu"
              >
                <DatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<FormFieldSearch>
                name={"endDate"}
                label="Ngày kết thúc"
              >
                <DatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Khu vực" name={["managementArea"]}>
                <GeoTreeSelect
                  autoClearSearchValue
                  labelInValue={true}
                  listItemHeight={150}
                  multiple={true}
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  showEnabledValuesOnly={true}
                  showSearch={true}
                  size="middle"
                  treeCheckStrictly={true}
                  treeCheckable={true}
                  treeDefaultExpandedKeys={["1", "2", "3"]}
                  checkablePositions={[
                    RELATIVE_POSITION.IS_CHILD,
                    RELATIVE_POSITION.IS_EQUAL,
                  ]}
                  onChange={(value: any) => {
                    onParamChange({
                      managementArea: value
                        ?.map((item: any) => get(item, "value"))
                        ?.join(","),
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#C4E4FF",
            },
          },
        }}
      >
        <TableAnt
          stickyTop
          className="table-striped-rows-custom"
          columns={columns}
          dataSource={bills}
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={pagingTable(paging, onParamChange)}
          size="small"
          bordered
          // scroll={{ y: "60vh", x: 800 }}
        />
      </ConfigProvider>
    </div>
  );
}
