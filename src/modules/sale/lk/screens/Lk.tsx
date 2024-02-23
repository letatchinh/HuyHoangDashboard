import { Button, Col, Flex, Modal, Row, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { REF_COLLECTION, REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import PaymentModule from "~/modules/paymentVoucher";
import { formatter, pagingTable } from "~/utils/helpers";
import {
  useGetLks,
  useLkPaging,
  useLkQueryParams,
  useUpdateLkParams,
} from "../lk.hook";
import billModule from '~/modules/sale/bill';
import SearchAnt from "~/components/Antd/SearchAnt";


type propsType = {};
export default function Lk(props: propsType): React.JSX.Element {
  // Hook
    const [reFetch,setReFetch] = useState(false);
    const mutate = useCallback(() => setReFetch(!reFetch),[reFetch]);
    const [query] = useLkQueryParams(reFetch);
    const [keyword, { setKeyword, onParamChange }] =
      useUpdateLkParams(query);
    const [data, isLoading] = useGetLks(query);
    const paging = useLkPaging();
  const [dataInitForm, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const onOpenPayment = (newData: any) => {
    setOpen(true);
    setData(newData);
  };
  const onClosePayment = () => {
    setOpen(false);
  };
  const columns: ColumnsType = [
    {
      title: "Mã thuốc",
      dataIndex: "variants",
      key: "variants",
      render(variants, record, index) {
        const variant = variants?.find((item : any) => get(item,'variantIsDefault'))
        return (
          <span>
            <Typography.Text strong>
              {get(variant, "variantCode", "")}
            </Typography.Text>
          </span>
        );
      },
    },
    {
      title: "Mặt hàng",
      dataIndex: "product",
      key: "product",
      render(product, record, index) {
        return (
          <span>
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} -{" "}
            </Typography.Text>
            {get(product, "name")}
          </span>
        );
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render(supplier, record, index) {
        return <span>{get(supplier, "name","")}</span>;
      },
    },
    {
      title: "Chương trình luỹ kế",
      dataIndex: "discount",
      key: "discount",
      render(discount, record, index) {
        return <span>{get(discount, "name")}</span>;
      },
    },
    {
      title: "Đã tích luỹ",
      dataIndex: "totalCumulative",
      key: "totalCumulative",
      render(totalCumulative, record, index) {
        return <span>{formatter(totalCumulative)}</span>;
      },
    },
    {
      title: "Thưởng",
      dataIndex: "discount",
      key: "discount",
      render(discount, record, index) {
        return <span>{formatter(get(discount,'actualClamp',0))}</span>;
      },
    },
    {
      title: "Nhà thuốc",
      dataIndex: "pharmacy",
      key: "pharmacy",
      align: "center",
      render(pharmacy, record, index) {
        return <span>{get(pharmacy, "name")}</span>;
      },
    },
    {
      title: "Đơn hàng",
      dataIndex: "bills",
      key: "bills",
      align: "center",
      render(bills, record, index) {
        return (
          <Flex vertical>
            {bills?.map((item: any) => (
              <Typography.Text strong>
                {get(item, "code")}
              </Typography.Text>
            ))}
          </Flex>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "action",
      align: "center",
      fixed : 'right',
      render(_id, record: any, index) {
        const { discount, pharmacy } = record;
        return (
          <Button
            onClick={() => {
              onOpenPayment({
                totalAmount: get(discount,'actualClamp',0),
                pharmacyId: get(pharmacy, "_id"),
                method: {
                  data: {
                    ...get(discount,'cumuSession'),
                  },
                  type: "LK",
                },
                refCollection: REF_COLLECTION_UPPER["PHARMA_PROFILE"],
              });
            }}
            size="small"
            type="primary"
          >
            Tạo Phiếu chi
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      <h5>Các mặt hàng luỹ kế đã tích luỹ</h5>
      <WhiteBox>
      <Row>
        <Col span={6}>
        <billModule.components.SelectPharmacy allowClear showIcon={false} size={'middle'} onChange={(value) => onParamChange({pharmacyId : value})}/>
        </Col>
        <Col span={6}>
        <SearchAnt value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange} placeholder="Tìm bất kỳ..."/>
        </Col>
      </Row>
        <TableAnt 
        dataSource={data} 
        columns={columns} 
        size="small" 
        pagination={pagingTable(paging,onParamChange)}
        scroll={{x : 1500}}
        />
      </WhiteBox>
      <Modal
        title="Phiếu chi"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={'auto'}
        footer={null}
        destroyOnClose
      >
        <PaymentModule.components.PaymentVoucherFormPharmacy
          onClose={() => onClosePayment()}
          initData={dataInitForm}
          callback={mutate}
        />
      </Modal>
    </div>
  );
}
