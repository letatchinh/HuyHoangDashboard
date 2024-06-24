import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { concatAddress, formatNumberThreeComma } from "~/utils/helpers";
import {
  useConvertPharmacy,
  useDeletePharmacy,
  useGetPharmacies,
  usePharmacyPaging,
  usePharmacyQueryParams,
  useUpdatePharmacy,
  useUpdatePharmacyParams,
} from "../pharmacy.hook";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { omit, get, map, truncate } from "lodash";
import {
  REF_COLLECTION_UPPER,
  STATUS,
  STATUS_NAMES,
} from "~/constants/defaultValue";
import moment from "moment";
// import ColumnActions from "~/components/common/ColumnAction";
import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
  Tabs,
  Typography,
  message,
  Form,
} from "antd";
import Search from "antd/es/input/Search";
import { FileTextOutlined,ImportOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PharmacyForm from "./PharmacyForm";
import {
PROCESS_STATUS_VI,
} from "../pharmacy.modal";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import ModalAnt from "~/components/Antd/ModalAnt";
import ReceiptVoucherForm from "~/modules/receiptVoucher/components/ReceiptVoucherForm";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { useChangeDocumentTitle } from "~/utils/hook";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import { FormImportFile } from "~/components/common/ImportFile/FormImportFile";

import ActionColumns from "./ActionColumns";
import StatusProcess from "./StatusProcess";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";

export default function Pharmacy() {
  const { t }: any = useTranslate();
  const [destroy,setDestroy] = useState(false);
  const [approved, setApproved] = useState(true);
  const [query] = usePharmacyQueryParams(approved);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdatePharmacyParams(query);
  const [pharmacies, isLoading] = useGetPharmacies(query);

  const onCloseForm = useCallback(() => {
    setPharmacyId(null);
    setIsOpenForm(false);
  }, []);

  const [, updatePharmacy] = useUpdatePharmacy(onCloseForm);
  const [isSubmitLoading, deletePharmacy] = useDeletePharmacy();
  const [pharmacyId, setPharmacyId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const paging = usePharmacyPaging();
  const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_VOUCHERPHARMACY);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PHARMAPROFILE);

  const canReadDebt = useMatchPolicy(POLICIES.READ_DEBTPHARMACY);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const [activeTab, setActiveTab] = useState("1");
  const [isLoadingSubmit, handleConvert] = useConvertPharmacy();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PHARMAPROFILE);
  const canDelete = useMatchPolicy(POLICIES.DELETE_PHARMAPROFILE);
  const [form] = Form.useForm();
  
  const onChangeTab = (newActiveKey: string) => {
    setActiveTab(newActiveKey);
    setApproved(newActiveKey !== "1" ? false : true);
    onParamChange({
      page: 1,
      approved: newActiveKey !== "1" ? false : true,
      status: null,
      processStatus: null,
    });
  };

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setPharmacyId(id);
        setDestroy(true);
      }
      setIsOpenForm(true);
    },
    [setPharmacyId, setIsOpenForm]
  );
  const [open, setOpen] = useState(false);
  const [debt, setDebt] = useState<number | null>();

  const onOpenReceipt = (item: any) => {
    setOpen(true);
    setPharmacyId(item?._id);
    setDebt(item?.resultDebt);
  };
  const onCloseReceipt = () => {
    setOpen(false);
    setPharmacyId(null);
  };

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã khách hàng",
        // dataIndex: "code",
        key: "code",
        width: 120,
        fixed: activeTab==='1'? "left":false,
        render: (record) => {
          return (
            <WithPermission permission={POLICIES.READ_PHARMAPROFILE}>
              <Link
                className="link_"
                to={`/pharmacy/${record?._id}`}
                target={"_blank"}
              >
                {record?.code}
              </Link>
            </WithPermission>
          );
        },
      },
      {
        title: "Tên khách hàng",
        dataIndex: "name",
        fixed: activeTab==='2'?"left":false,
        key: "name",
        width: 180,
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: 120,
      },

      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 350,
        render(value, record, index) {
          return concatAddress(value);
        },
      },
      {
        title: "Kênh bán hàng",
        dataIndex: "salesChannel",
        key: "salesChannel",
        width: 180,
        render: (record) => {
          return get(record, "title");
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Trình dược viên",
        dataIndex: "employee",
        key: "employee",
        width: 180,
        render: (record) => {
          return get(record, "fullName");
        },
      },
      ...(canReadDebt ? [{
        title: "Công nợ",
        dataIndex: "resultDebt",
        key: "resultDebt",
        width: 180,
        render(value: any) {
          return formatNumberThreeComma(value);
        },
      }] : []),
      {
        title: "File đính kèm",
        dataIndex: "files",
        key: "files",
        width: 180,
        align: "left",
        render(record) {
          const render = map(record, (item) => (
            <Tooltip title={item?.name?.length > 16 ? item?.name : ""}>
              <a download href={item?.url} target="_blank" style={{ cursor: "pointer"}}>
                <FileTextOutlined style={{ marginRight: '5px'}} />
                {truncate(item?.name, { 'length': 16 })}
              </a>
            </Tooltip>
          ))
          return <Flex vertical >{render}</Flex>
        },
      },
      {
        title: "Người tạo",
        dataIndex: "createdBy",
        key: "createdBy",
        width: 180,
        render(value) {
          return value?.fullName;
        },
      },
      {
        title: "Người duyệt",
        dataIndex: "approveBy",
        key: "approveBy",
        width: 180,
        render(value) {
          return value?.fullName;
        },
      },
      ...(canWriteVoucher
        ? [
            {
              title: "Tạo phiếu",
              dataIndex: "createReceipt",
              key: "createReceipt",
              width: 120,
              render(value: any, rc: any) {
                return (
                  <Space>
                    <Button type="primary" onClick={() => onOpenReceipt(rc)}>
                      Phiếu thu
                    </Button>
                  </Space>
                );
              },
            },
          ]
        : []),
      ...(activeTab === "1"
        ? [
            {
              title: "Trạng thái",
              key: "status",
              dataIndex: "status",
              width: 100,
              align: "center" as any,
              render: (status: any, record: any) => {
                return canUpdate ? (
                  <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
                    <Switch
                      checked={status === "ACTIVE"}
                      onChange={(value) =>
                        onChangeStatus(
                          get(record, "_id"),
                          value ? STATUS["ACTIVE"] : STATUS["INACTIVE"],
                          isLoading,
                          record
                        )
                      }
                    />
                  </WithPermission>
                ) : (
                  <Switch checked={status === "ACTIVE"} />
                );
              },
            },
          ]
        : []),
      ...(activeTab === "2"
        ? [
            {
              title: "Trạng thái",
              key: "processStatus",
              dataIndex: "processStatus",
              width: 100,
              align: "center" as any,
              render: (processStatus: any, record: any) => {
                return <StatusProcess processStatus={processStatus} />;
              },
            },
          ]
        : []),
      ...(canDownload
        ? [
            {
              title: "Lựa chọn",
              key: "_id",
              width: 80,
              align: "center" as any,
              render: (item: any, record: any) => {
                const id = record._id;
                return (
                  <Checkbox
                    checked={arrCheckBox.includes(id)}
                    onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                  />
                );
              },
            },
          ]
        : []),
      ...(canUpdate || canDelete
        ? [
            {
              title: "Thao tác",
              dataIndex: "_id",
              key: "_id",
              align: "center" as any,
              fixed: "right" as any,
              width: 140,
              render: (_id: string, record: any) => {
                return (
                  <ActionColumns
                    onConvert={handleConvert}
                    onDelete={deletePharmacy}
                    onOpenForm={onOpenForm}
                    _id={_id}
                    isSubmitLoading={isLoadingSubmit}
                    record={record}
                  />
                );
              },
            },
          ]
        : []),
    ],
    [arrCheckBox, canWriteVoucher, canDownload, canUpdate, canDelete, activeTab]
  );

  const onChangeStatus = (
    _id: any,
    status: any,
    isSubmitLoading: any,
    record: any
  ) => {
    updatePharmacy({
      _id,
      status,
      isSubmitLoading,
      ...omit(record, ["_id", "status"]),
    });
  };

  const onChange = (e: any) => {
    onParamChange({ ...query, status: e.target.value, processStatus: null });
  };
  useChangeDocumentTitle("Danh sách khách hàng B2B");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Breadcrumb title={t("list-pharmacies")} />
      <WhiteBox>
        <Row className="mb-3" justify={"space-between"}>
          <Col span={8}>
            <Search
              enterButton="Tìm kiếm"
              placeholder="Nhập để tìm kiếm"
              allowClear
              onSearch={() => onParamChange({ keyword })}
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
            />
          </Col>
          <Row>
            <WithPermission permission={POLICIES.WRITE_PHARMAPROFILE}>
              <Col>
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  style={{ float: "right", margin: "0px 10px" }}
                  onClick={() => onOpenForm()}
                >
                  Thêm mới
                </Button>
              </Col>
            </WithPermission>
            <WithPermission permission={POLICIES.WRITE_PHARMAPROFILE}>
              <Col>
                <Button
                  icon={<ImportOutlined />}
                  type="primary"
                  style={{ float: "right", margin: "0px 10px" }}
                  onClick={showModal}
                >
                  {" "}
                  Import
                </Button>
              </Col>
            </WithPermission>
            <WithPermission permission={POLICIES.DOWNLOAD_PHARMAPROFILE}>
              <Col>
                <ExportExcelButton
                  fileName="Danh sách khách hàng B2B"
                  api="pharma-profile"
                  exportOption="pharma"
                  query={query}
                  ids={arrCheckBox}
                />
              </Col>
            </WithPermission>
          </Row>
        </Row>
        {activeTab === "1" && (
          <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
            <Row justify={"space-around"}>
              <Col span={12}>
                <Space style={{ marginBottom: 20 }}>
                  <Typography style={{ fontSize: 14, marginRight: 20 }}>
                    Phân loại trạng thái theo :
                  </Typography>
                  <Row gutter={14}>
                    <Radio.Group
                      onChange={onChange}
                      optionType="button"
                      buttonStyle="solid"
                      defaultValue={query?.status}
                    >
                      <Radio.Button value={null}>Tất cả</Radio.Button>
                      <Radio.Button value={"ACTIVE"}>
                        {STATUS_NAMES["ACTIVE"]}
                      </Radio.Button>
                      <Radio.Button value={"INACTIVE"}>
                        {STATUS_NAMES["INACTIVE"]}
                      </Radio.Button>
                    </Radio.Group>
                  </Row>
                </Space>
              </Col>
              <Col span={12}>
                <Space
                  style={{
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography style={{ fontSize: 14, marginRight: 20 }}>
                    Kênh bán hàng:
                  </Typography>
                  <Form
                    form={form}
                    initialValues={{ salesChannel: query?.salesChannel }}
                  >
                    <SelectSaleChannel
                      validateFirst={false}
                      form={form}
                      style={{ minWidth: 200 }}
                      showIcon={false}
                      size={"middle"}
                      defaultValue={query?.salesChannel || null}
                      divisionText="B2B"
                      onChange={(value) =>
                        onParamChange({ salesChannel: value })
                      }
                      mode="multiple"
                    />
                  </Form>
                </Space>
              </Col>
            </Row>
          </WithPermission>
        )}
        {activeTab === "2" && (
          <Space style={{ marginBottom: 20 }}>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Phân loại trạng thái theo :
            </Typography>
            <Row gutter={14}>
              <Radio.Group
                onChange={(e) =>
                  onParamChange({
                    ...query,
                    status: null,
                    processStatus: e.target.value,
                  })
                }
                optionType="button"
                buttonStyle="solid"
                defaultValue={query?.processStatus}
              >
                {Object.entries(PROCESS_STATUS_VI).map(([key, value]: any) => (
                  <Radio.Button key={key} value={key}>
                    {value}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Row>
          </Space>
        )}
        <Tabs
          defaultActiveKey={activeTab}
          onChange={onChangeTab}
          destroyInactiveTabPane
        >
          <Tabs.TabPane key={"1"} tab="Chính thức">
            <TableAnt
              dataSource={pharmacies}
              loading={isLoading}
              rowKey={(rc) => rc?._id}
              scroll={{ x: "max-content" ,y:'calc(100vh - 383px)'}}
              columns={columns}
              size="small"
              pagination={{
                ...paging,
                onChange(page, pageSize) {
                  onParamChange({ page, limit: pageSize });
                },
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng: ${total} `,
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={"2"} tab="Đang chờ duyệt">
            <TableAnt
              dataSource={pharmacies}
              loading={isLoading}
              rowKey={(rc) => rc?._id}
              scroll={{ x: "max-content" ,y: 'calc(100vh - 383px)'}}
              columns={columns}
              size="small"
              pagination={{
                ...paging,
                onChange(page, pageSize) {
                  onParamChange({ page, limit: pageSize });
                },
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng: ${total} `,
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
      <ModalAnt
        width={1100}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose={destroy}
        afterClose={() => setDestroy(false)}
      >
        <PharmacyForm
          setDestroy={setDestroy}
          onClose={onCloseForm}
          id={pharmacyId}
          handleUpdate={updatePharmacy}
          query={query}
        />
      </ModalAnt>
      <Modal
        title="Phiếu thu"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <ReceiptVoucherForm
          onClose={() => onCloseReceipt()}
          pharmacyId={pharmacyId}
          refCollection={REF_COLLECTION_UPPER.PHARMA_PROFILE}
          debt={debt}
          from="Pharmacy"
          dataAccountingDefault={[
            {
              debitAccount: 1111,
              amountOfMoney: debt || 0,
            },
          ]}
        />
      </Modal>
      <FormImportFile
        onModule={handleOk}
        isModalOpen={isModalOpen}
        onClose={handleCancel}
        query={query}
      />
    </div>
  );
}
