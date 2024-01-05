import { ColumnsType } from "antd/es/table/InternalTable";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useEmployeePaging,
  useEmployeeQueryParams,
  useGetEmployeees,
  useUpdateEmployeeParams,
} from "../employee.hook";
import { Button, Col, Modal, Row } from "antd";
import { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import TableAnt from "~/components/Antd/TableAnt";
import SelectSearch from "~/components/common/SelectSearch";


export default function Employee() {
  const { t }: any = useTranslate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [query] = useEmployeeQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateEmployeeParams(query);
  const [data, isLoading] = useGetEmployeees(query);
  const paging = useEmployeePaging();
  const [id, setId] = useState("");
  
  const handleOpenModal = (id?: any) => {
    setIsOpenModal(true);
    setId(id);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setId("");
  };

  const columns: ColumnsType = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      render: (value: any, record: any) => (
        <Button type="link" onClick={() => handleOpenModal(record._id)}>{value}</Button>
      ),
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Thao tác',
      key: 'action',
    },
  ];
  return (
    <div>
      <Breadcrumb title={t("Quản lý nhân viên")} />
      <Row gutter={16} align="middle">
        <Col span={21}></Col>
        <Col span={3}>
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm mới
          </Button>
        </Col>
      </Row>
      <WhiteBox>
        <SelectSearch
          showSelect={false}
        />
        <TableAnt
          dataSource={data?.length ? data  : []}
          // loading={isLoading}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              // onParamChange({ page, limit: pageSize });
            },
          }}
        />
      </WhiteBox>
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => setIsOpenModal(false)}
        className="form-modal"
        footer={null}
        width={1020}
        style={{ top: 50 }}
        destroyOnClose
      >
        <EmployeeForm
          id={id}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
