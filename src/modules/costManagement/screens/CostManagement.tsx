
import { Button, Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useMemo, useState } from 'react';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useCostManagementQueryParams, useGetCostManagements, useUpdateCostManagementParams } from '../costManagement.hook';
import dayjs from 'dayjs';
import { ApartmentOutlined, BehanceSquareOutlined, FilterOutlined, CloudServerOutlined, DollarOutlined, MediumOutlined, ShoppingOutlined, PlusOutlined } from '@ant-design/icons';
import { FormFieldSearch, SearchByType } from '~/modules/supplier/supplier.modal';
import CostManagementForm from '../components/CostManagementForm';
import CostManagementCard from '../components/CostManegementCard';
import { useGetBranches } from '~/modules/branch/branch.hook';
import { get, transform } from 'lodash';
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
  console.log(costManagement[0]?.cost, 'costManagement');
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
    console.log(values, 'values');
    if (startDate) {
      switch (searchBy) {
        case "date":
          onParamChange({
            startDate: dayjs(startDate)
              .startOf(searchBy)
              .format("YYYY-MM-DD"),
            endDate: dayjs(endDate).endOf(searchBy).format("YYYY-MM-DD"),
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
  }
  const options = useMemo(() => dataBranch?.map((item: any) => ({
    label: get(item, 'name'),
    value: get(item, '_id')
  })), [dataBranch]);
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
        <Row gutter={16}>
          <Col span={4}>
            <CostManagementCard
              onClick={() => { }}
              title="Chi phí vận chuyển"
              value={costManagement[0]?.cost?.logistic || 0}
              icon={<ShoppingOutlined className="homepage--btnAction__icon" />}
            />
          </Col>
          <Col span={4}>
            <CostManagementCard
              onClick={() => { }}
              title="Chi phí vận hành"
              value={costManagement[0]?.cost?.operations || 0}
              icon={<DollarOutlined className="homepage--btnAction__icon" />}
            />
          </Col>
          <Col span={4}>
            <CostManagementCard
              onClick={() => { }}
              title="Chi phí kênh phân phối"
              value={costManagement[0]?.cost?.distributionChannel || 0}
              icon={<ApartmentOutlined className="homepage--btnAction__icon" />}
            />
          </Col>
          <Col span={4}>
            <CostManagementCard
              onClick={() => { }}
              title="Chi phí maketing"
              value={costManagement[0]?.cost?.marketing || 0}
              icon={<MediumOutlined className="homepage--btnAction__icon" />}
            />
          </Col>
          <Col span={4}>
            <CostManagementCard
              onClick={() => { }}
              title="Chi phí quản lý"
              value={costManagement[0]?.cost?.management || 0}
              icon={<CloudServerOutlined className="homepage--btnAction__icon" />}
            />
          </Col>
        </Row>
      </WhiteBox>

      <Modal
        destroyOnClose
        open={isOpenForm}
        footer={null}
        onCancel={onCancel}
        width={1050}
      >
        <CostManagementForm onCancel={onCancel} />
      </Modal>
    </div>
  )
}