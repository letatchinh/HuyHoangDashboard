
import { Button, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Space, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useCallback, useMemo, useState } from 'react';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useCostManagementPaging, useCostManagementQueryParams, useDeleteCostManagement, useGetCostManagements, useUpdateCostManagementParams } from '../costManagement.hook';
import dayjs from 'dayjs';
import { ApartmentOutlined, BehanceSquareOutlined, FilterOutlined, CloudServerOutlined, DollarOutlined, MediumOutlined, ShoppingOutlined, PlusOutlined, InfoCircleTwoTone, DeleteOutlined } from '@ant-design/icons';
import { FormFieldSearch, SearchByType } from '~/modules/supplier/supplier.modal';
import CostManagementForm from '../components/CostManagementForm';
import CostManagementCard from '../components/CostManegementCard';
import { useGetBranches } from '~/modules/branch/branch.hook';
import CostManagementTable from '../components/CostManagementTable';
import { get, transform } from 'lodash';
import TableAnt from '~/components/Antd/TableAnt';
import ActionColumn from '~/components/common/ActionColumn';
import { ColumnsType } from 'antd/es/table';
import { formatter } from '~/utils/helpers';
import useCheckBoxExport from '~/modules/export/export.hook';
import ExportExcelButton from '~/modules/export/component';
type propsType = {

}
export default function CostManagement(props: propsType): React.JSX.Element {
  const { t }: any = useTranslate();
  const defaultDate = {
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
  };
  const nQuery = useMemo(() => ({ page: 1, limit: 10 }), []);

  const [dataBranch, isLoadingBranch] = useGetBranches(nQuery);
  const [form] = Form.useForm();
  const [isOpenForm, setOpenForm] = useState(false);
  const [query] = useCostManagementQueryParams();
  const [costManagement, isLoading] = useGetCostManagements(query);
  const [id,setId] = useState(null)
  // console.log(costManagement[0]?.cost, 'costManagement');
  const [isSubmitLoading, onDelete] = useDeleteCostManagement();
  const paging = useCostManagementPaging();

  const onOpenForm = useCallback((id?: any) => {
    if (id) {
      setId(id);
    }
    setOpenForm(true);
  }, []);
  const [keyword, { setKeyword, onParamChange }] = useUpdateCostManagementParams(query);
  const [value1, setValue1] = useState('');
  const optionsSearchBy = [
    {
      label: "Theo ngày",
      value: "date",
    },
    {
      label: "Theo tháng",
      value: "month",
    },
    {
      label: "Theo quý",
      value: "quarter",
    },
    {
      label: "Theo năm",
      value: "year",
    },
  ];
  const searchBy: SearchByType = Form.useWatch("searchBy", form);

  const onFinish = (values: FormFieldSearch) => {
    const { searchBy, startDate, endDate } = values;
    if (startDate) {
      switch (searchBy) {
        case "date":
          onParamChange({
            startDate:startDate? dayjs(startDate)
              .startOf(searchBy)
              .format("YYYY-MM-DD"):null,
            endDate:endDate ? dayjs(endDate).endOf(searchBy).format("YYYY-MM-DD"):null,
          });
          break;
        case "month":
        case "quarter":
        case "year":
          onParamChange({
            startDate: dayjs(startDate)
              .startOf(searchBy)
              .format("YYYY-MM-DD"),
            endDate: dayjs(startDate)
              .endOf(searchBy)
              .format("YYYY-MM-DD"),
          });
          break;

        default:
          break;
      }
    } else {
      onParamChange({
        startDate: null,
        endDate: null,
      })
    }

  };
  const onCancel = () => {
    setOpenForm(false);
  };
  const onCloseForm = useCallback(() => {
    setId(null);
    setOpenForm(false);
  }, []);
  const options = useMemo(() => dataBranch?.map((item: any) => ({
    label: get(item, 'name'),
    value: get(item, '_id')
  })), [dataBranch]);
  const handleOpenUpdate = (id: any) => {
    setOpenForm(true);
      setId(id);
  };
  const handleOpenFormCreate = () => { 
    setId(null);
    setOpenForm(true);
  };
  const handleDelete = (id: any) => {
    onDelete(id);

  };
  const columns: ColumnsType = [
    {
      title: "Mã sản phẩm",
      dataIndex: "variant",
      key: "variant",
      render : (variant) => {
        return get(variant,'variantCode','')
      }
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width : 300,
      render(name, record) {
        const codeBySupplier = get(record,'codeBySupplier','');
        if (get(record, "variants", [])?.length > 1) {
          const options = get(record, "variants", [])?.map((item) => ({
            label: get(item, "unit.name"),
            value: get(item, "_id"),
          }));
          return (
            <Row align={"middle"} gutter={4} wrap={false}>
              <Col>
              <Typography.Text strong>{codeBySupplier} - </Typography.Text>
              </Col>
              <Col>{name}</Col>
              <Col>
                <Select
                  style={{minWidth : 50}}
                  value={get(record,'variant._id')}
                  options={options}
                  onChange={(value) =>{}
                    // onChangeVariantDefault({
                    //   productId: get(record, "_id"),
                    //   variantId: value,
                    // })
                  }
                />
              </Col>
            </Row>
          );
        } else {
          return <span>
              <Typography.Text strong>{codeBySupplier} - </Typography.Text>
            {name + " " + `(${get(record, "variant.unit.name")})`}
          </span>;
        }
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render(totalAmount, record, index) {
        return formatter(get(record,'totalAmount',0))
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record: any) => (
        <Space size="middle">
          {/* <WithPermission permission={POLICIES.UPDATE_PRODUCTGROUP}> */}
            <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenUpdate(record?._id)}>
              Cập nhật chi phí
            </Button>
          {/* </WithPermission>
          <WithPermission permission={POLICIES.DELETE_PRODUCTGROUP}> */}
            <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
              Xóa
            </Button>
          {/* </WithPermission> */}
        </Space>
      ),
    },
  ];
  return (
    <div className="page-wrapper page-costManagement">
      <Breadcrumb title={t('Quản lý danh sách chi phí sản phẩm')} />
      {/* <Text>Tổng doanh thu theo chi nhánh {costManagement.financialCost}</Text> */}
      <Row style={{ marginBottom: 10 }} gutter={8}>
        <Col span={6}>
          <Select
            options={options}
            loading={isLoadingBranch}
            mode='multiple'
            allowClear
            style={{ minWidth: 200 }}
            onChange={(e) => {
              console.log(e)
              onParamChange({ ['branchId']: e?.join(',') });
              setKeyword(e?.join(','));

            }}
            placeholder="Chi nhánh"
            {...props}
          />
        </Col>
        <Col flex={1}>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              startDate: defaultDate.startDate,
              endDate: defaultDate.endDate,
              searchBy: "date",
            }}
          >
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item<any> name={"searchBy"}>
                  <Select options={optionsSearchBy} />
                </Form.Item>
              </Col>
              {
                {
                  date: (
                    <>
                      <Col>
                        <Form.Item<any>
                          name={"startDate"}
                          label="Ngày bắt đầu"
                        >
                          <DatePicker format={"YYYY-MM-DD"} />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item<any>
                          name={"endDate"}
                          label="Ngày kết thúc"
                        >
                          <DatePicker format={"YYYY-MM-DD"} />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  month: (
                    <>
                      <Col>
                        <Form.Item<any>
                          name={"startDate"}
                          label="Tháng"
                        >
                          <DatePicker picker="month" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  quarter: (
                    <>
                      <Col>
                        <Form.Item<any>
                          name={"startDate"}
                          label="Quý"
                        >
                          <DatePicker picker="quarter" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  year: (
                    <>
                      <Col>
                        <Form.Item<any>
                          name={"startDate"}
                          label="Năm"
                        >
                          <DatePicker picker="year" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                }[searchBy]
              }
              <Col>
                <Button
                  htmlType="submit"
                  icon={<FilterOutlined />}
                  type="primary"
                >
                  Áp dụng bộ lọc
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    setOpenForm(true);
                  }}
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  Thêm chi phí
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <WhiteBox>
      <TableAnt
          dataSource={costManagement}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          // scroll={{x : 2000}}
          stickyTop
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger : true,
            showTotal: (total) => `Tổng cộng: ${total} `,
            size:"small"
          }}
        />
      </WhiteBox>

      <Modal
        destroyOnClose
        open={isOpenForm}
        footer={null}
        onCancel={onCancel}
        width={1050}
      >
        <CostManagementForm id={id} onCancel={onCancel} />
      </Modal>
    </div>
  )
}