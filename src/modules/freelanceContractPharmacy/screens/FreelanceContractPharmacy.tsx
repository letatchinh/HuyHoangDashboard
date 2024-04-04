import React, { useCallback, useMemo, useState } from "react";
import {
  useDeleteFreelanceContractPharmacy,
  useFreelanceContractPharmacyPaging,
  useFreelanceContractPharmacyQueryParams,
  useGetFreelanceContractPharmacies,
  useGetFreelanceContractPharmacy,
  useUpdateFreelanceContractPharmacy,
  useUpdateFreelanceContractPharmacyParams,
} from "../freelanceContractPharmacy.hook";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { ColumnsType } from "antd/es/table";
import POLICIES from "~/modules/policy/policy.auth";
import moment from "moment";
import { formatNumberThreeComma } from "~/utils/helpers";
import WithPermission from "~/components/common/WithPermission";
import {
  Button,
  Col,
  Popconfirm,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import { PlusCircleOutlined } from "@ant-design/icons";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import ModalAnt from "~/components/Antd/ModalAnt";
import FreelanceContractPharmacyForm from "./FreelanceContractPharmacyForm";
import Breadcrumb from "~/components/common/Breadcrumb";
import { get } from "lodash";
type propsType = {};
export default function FreelanceContractPharmacy(
  props: propsType
): React.JSX.Element {
  const [query] = useFreelanceContractPharmacyQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateFreelanceContractPharmacyParams(query);
  const [contracts, isLoading] = useGetFreelanceContractPharmacies(query);
  const [contractId, setContractId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const onCloseForm = useCallback(() => {
    setContractId(null);
    setIsOpenForm(false);
  }, []);

  const [, updateContract] = useUpdateFreelanceContractPharmacy(onCloseForm);
  const [isSubmitLoading, deleteContract] = useDeleteFreelanceContractPharmacy();
  const paging = useFreelanceContractPharmacyPaging();
  const canUpdateContract = useMatchPolicy(POLICIES.UPDATE_CONTRACTPHARMACY);
  const canDeleteContract = useMatchPolicy(POLICIES.DELETE_CONTRACTPHARMACY);

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setContractId(id);
      }
      setIsOpenForm(true);
    },
    [setContractId, setIsOpenForm]
  );


  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã hợp đồng",
        dataIndex: "contractCode",
        key: "contractCode",
        width: 120,
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacyId",
        key: "pharmacyId",
        // align: "center",
        render(pharmacyId, record, index) {
          return <Typography.Text>{get(pharmacyId, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "date",
        key: "date",
        width: 120,
        align: "center",
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
        width: 120,
        render(value) {
          return formatNumberThreeComma(value);
        },
      },
      {
        title: "Thời hạn",
        dataIndex: "resultDate",
        key: "resultDate",
        width: 180,
        render (resultDate) {
          return resultDate.replace("years", "năm").replace("year", "năm").replace("months", "tháng").replace("month", "tháng").replace("days", "ngày").replace("month", "tháng").replace("day", "ngày");
        }
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
        width: 120,
        align: "center",
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      
      {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        key: "endDate",
        width: 120,
        align: "center",
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "File đính kèm",
        dataIndex: "files",
        key: "files",
        // align: "center",
        render(record) {
          return <Typography.Text>{record}</Typography.Text>;
        },
      },
      {
        title: "Thao tác",
        dataIndex: "_id",
        // key: "actions",
        width: 150,
        align: "center" as any,
        render: (record: any) => {
          return (
            <div className="custom-table__actions">
              <WithPermission permission={POLICIES.UPDATE_CONTRACTPHARMACY}>
                <p onClick={() => onOpenForm(record)}>Sửa</p>
              </WithPermission>
              <WithPermission permission={POLICIES.DELETE_CONTRACTPHARMACY}>
                <p>|</p>
                <Popconfirm
                  title={`Bạn muốn xoá hợp đồng này?`}
                  onConfirm={() => deleteContract(record)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <p>Xóa</p>
                </Popconfirm>{" "}
              </WithPermission>
            </div>
          );
        },
      },
    ],
    [canUpdateContract,canDeleteContract, contracts]
  );

  return (
    <div>
      <Breadcrumb title="Hợp đồng khoán nhà thuốc" />
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
        <WithPermission permission={POLICIES.WRITE_CONTRACTPHARMACY}>
          <Col>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => onOpenForm()}
            >
              Thêm mới
            </Button>
          </Col>
        </WithPermission>
      </Row>
      <WhiteBox>
        <TableAnt
          dataSource={contracts}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
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
          stickyTop
        />
      </WhiteBox>
      <ModalAnt
        width={900}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <FreelanceContractPharmacyForm
          onClose={onCloseForm}
          id={contractId}
          handleUpdate={updateContract}
        />
      </ModalAnt>
    </div>
  );
}
