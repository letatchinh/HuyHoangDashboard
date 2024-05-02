import {
  Button,
  Col,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import {
  useCostManagementPaging,
  useCostManagementQueryParams,
  useGetCostManagements,
  useUpdateCostManagementParams,
  handleChangeVariant,
  useUpdateCostManagement,
  useTotalRevenue,
} from "../costManagement.hook";
import {
  InfoCircleTwoTone,
  SearchOutlined,
} from "@ant-design/icons";

import CostManagementForm from "../components/CostManagementForm";
import { get } from "lodash";  
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table";
import { formatNumberThreeComma, formatter } from "~/utils/helpers";
import DatePickerAnt from "../components/DatePicker";
import { useDispatch } from "react-redux";
import { costManagementActions } from "../redux/reducer";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
type propsType = {};

interface DataType {
  code: string;
  _id: string;
  name: string;
  variants: any;
  totalAmount: number;
  profitValue: any;
  shippingCost: any;
};

type PickerType = 'month' | 'quarter' | 'year';

interface ContextCostManagement {
  id?: string | null;
  setDate?: any;
  date?: any;
  setTypeDate?: any;
  typeDate?: PickerType;
  setId?: any;
  onUpdate?: any;
  isSubmitLoading?: boolean;
  onCancel?: any;
};

const CostManagementContext = createContext<ContextCostManagement>({
  id: null,
  setDate: () => { },
  date: null,
  setTypeDate: () => { },
  typeDate: 'month',
  setId: () => { },
  onUpdate: () => { },
  isSubmitLoading: false,
  onCancel: () => { },
});

export const useCostManagementContext = (): ContextCostManagement => useContext(CostManagementContext);
 const CostManagement =(props: propsType)=>{
  const { t }: any = useTranslate();
  const [isOpenForm, setOpenForm] = useState(false);
   const [query] = useCostManagementQueryParams();
  const [costManagement, isLoading] = useGetCostManagements(query);
  const [keyword, { setKeyword, onParamChange }] = useUpdateCostManagementParams(query);
  const [id, setId] = useState(null);
  const paging = useCostManagementPaging();
  const [data, setData] = useState<any[]>([]);
  const handleConvertVariant = handleChangeVariant(data, setData);
  const [date, setDate] = useState<any>();
  const [typeDate, setTypeDate] = useState<PickerType>('month');
  const totalRevenue = useTotalRevenue();
   
   const dispatch = useDispatch();
   const resetState = () => {
     return dispatch(costManagementActions.resetActionFullState());
   };
   const canUpdate = useMatchPolicy(POLICIES.UPDATE_SHIPPINGCOST);

  useEffect(() => {
    if (costManagement) {
     const newData = costManagement?.map((item: any) => ({
        ...item,
        variantCurrent: get(item, "variants[0]", null)
      }));
      setData(newData);
    };
  }, [costManagement]);


  const handleChange = (value: any) => {
    onParamChange({
      ...value
    });
  };

  const onOpenForm = (id?: any) => {
    setId(id);
    setOpenForm(true);
  };
  
  const onCancel = ()=> {
    setOpenForm(false);
    setId(null);
  };
   const [isSubmitLoading, onUpdate] = useUpdateCostManagement(() => {
     onCancel();
     resetState();
   });

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã sản phẩm",
      dataIndex: "variantCurrent",
      key: "variantCode",
      width: 150,
      render: (variant) => {
        return get(variant, "variantCode", "");
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width : 300,
      render(name, record) {
        const codeBySupplier = get(record, "codeBySupplier", "");
        return (
          <>
            <Typography.Text strong>{codeBySupplier}</Typography.Text>
            <span> - {name}</span>
          </>
        )
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "variantCurrent",
      align: "center",
      key: "totalAmount",
      width: 150,
      render(totalAmount, record, index) {
        let options = [];
        if (get(record, "variants", [])?.length > 1) {
           options = get(record, "variants", [])?.map((item: any) => ({
            label: get(item, "unit.name"),
            value: get(item, "_id"),
          }));
        }
          return (
            get(record, "variants", [])?.length > 1 ?
          <Select
          style={{ minWidth: 100 }}
          options={options}
          defaultValue={get(record, "variants[0]._id", null)}
          onChange={(value) =>
            handleConvertVariant(get(record, "_id"), value)
          }
          />
          : get(record, "variants[0].unit.name", '')
        )
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "variantCurrent",
      align: "center",
      width: 150,
      key: "totalRevenueVariant",
      render(totalRevenueVariant, record, index) {
        return formatter(get(totalRevenueVariant, "totalRevenueVariant", 0));
      },
    },
    // {
    //   title: "Lợi nhuận",
    //   dataIndex: "variantCurrent",
    //   align: "center",
    //   width: 150,
    //   key: "profitValue",
    //   render(totalAmount, record, index) {
    //     return formatter(
    //       get(record, "profitValue") ? get(record, "profitValue", 0) : 0
    //     );
    //   },
    // },
    {
      title: "Giá bán",
      dataIndex: "variantCurrent",
      width: 150,
      key: "variants",
      render(variants, record, index) {
        return formatter(get(variants, "price", 0));
      },
    },
    {
      title: "Giá đầu vào",
      dataIndex: "variantCurrent",
      width: 150,
      key: "variants",
      render(variants, record, index) {
        return formatter(get(variants, "cost", 0));
      },
    },
    {
      title: "Chi phí vận chuyển",
      dataIndex: "variantCurrent",
      align: "center",
      width: 150,
      key: "logistic",
      render(value, record, index) {
        return formatter(
          get(value, "logistic",0) 
        );
      },
    },
    {
      title: "Chi phí kênh phân phối",
      dataIndex: "variantCurrent",
      align: "center",
      width: 200,
      key: "distributionChannel",
      render(value, record, index) {
        return formatter(get(record, "totalRevenueEmployee", 0) + get(value, "marketing", 0)
          + get(value, "management", 0) + get(value, "operations", 0));
      },
    },
    {
      title: "Chi phí tài chính",
      dataIndex: "variantCurrent",
      width: 150,
      align: "center",
      key: "financialCost",
      render(value, record, index) {
        return formatter(
          get(value, "financialCost",0)
        );
      },
    },
  ...(canUpdate ? [{
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center" as any,
      fixed: "right" as any,
      width: 120,
      render(_id: any, record: any, index: any) {
        return (
          <Row justify={"center"} align={"middle"} wrap={false}>
            <Button
              icon={<InfoCircleTwoTone />}
              onClick={() => {
                onOpenForm(_id);
              }}
              type="primary"
              size="small"
            >
              {"Cập nhật"}
            </Button>
          </Row>
        )
      }
    }] : []),
  ];

  return (
    <CostManagementContext.Provider value={{
      id,
      setDate,
      date,
      setTypeDate,
      typeDate,
      setId, 
      isSubmitLoading, 
      onUpdate,
      onCancel,

    }}>
    <div>
      <Breadcrumb title={t("Quản lý danh sách chi phí sản phẩm")} />
      <Row style={{ marginBottom: 10 }} gutter={8}>
        <Col span={6}>
          <Search
            placeholder="Nhập bất kì để tìm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            onSearch={(value) => onParamChange({keyword: value})}
            enterButton={<SearchOutlined />}
          />
        </Col>
        <Col span={6}>
          <DatePickerAnt  handleChange = {handleChange} />
        </Col>
        
      </Row>
      <WhiteBox>
        {/* <h5>Đơn vị: VND</h5> */}
          <TableAnt
            footer={() => <h5>{`Tổng doanh thu theo thời gian: ${isLoading ? "Đang tải..." : formatNumberThreeComma(totalRevenue)} đ`}</h5>}
          dataSource={data || []}
          loading={isLoading}
          columns={columns}
          scroll={{ x: 'max-content' }}
          stickyTop
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
            size: "small",
          }}
        />
      </WhiteBox>
      <Modal
        title = {'Cập nhật chi phí'}
        open={isOpenForm}
        footer={null}
        onCancel={onCancel}
        width={1050}
      >
        <CostManagementForm  />
      </Modal>
    </div>
    </CostManagementContext.Provider>
  );
 };
export default CostManagement;
