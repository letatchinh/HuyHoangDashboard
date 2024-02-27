import { Button, Col, Flex, Modal, Row, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import SearchAnt from "~/components/Antd/SearchAnt";
import TableAnt from "~/components/Antd/TableAnt";
import { REF_COLLECTION, REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import PaymentModule from "~/modules/paymentVoucher";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import billModule from '~/modules/sale/bill';
import { PATH_APP } from "~/routes/allPath";
import { pagingTable } from "~/utils/helpers";
import ProcessCumulative from "../components/ProcessCumulative";
import RewardCumulative from "../components/RewardCumulative";
import {
    useGetLks,
    useLkPaging,
    useLkQueryParams,
    useUpdateLkParams
} from "../lk.hook";
import { getValueOfLk } from "../lk.service";


type propsType = {
    cumulativeSession : 'IN' | 'OUT',
    options? : {
        action? : boolean,
        showVoucher? : boolean,
    }
};
export default function LkTabItem({cumulativeSession,options}: propsType): React.JSX.Element {
  // Hook
    const [reFetch,setReFetch] = useState(false);
    const mutate = useCallback(() => setReFetch(!reFetch),[reFetch]);
    const [query] = useLkQueryParams(reFetch,cumulativeSession);
    const [keyword, { setKeyword, onParamChange }] =
      useUpdateLkParams(query);
    const [data, isLoading] = useGetLks(query);
    const paging = useLkPaging();
  const [dataInitForm, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [openVoucher,setOpenVoucher] = useState(false);
  const [idVoucher,setIdVoucher] = useState<string | null>(null);
  const onOpenPayment = (newData: any) => {
    setOpen(true);
    setData(newData);
  };
  const onClosePayment = () => {
    setOpen(false);
  };
  const onOpenVoucher = (id: any) => {
    setOpenVoucher(true);
    setIdVoucher(id);
  };
  const onCloseVoucher = () => {
    setOpenVoucher(false);
    setIdVoucher(null);
  };
  const columns: ColumnsType = [
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
        title: "Nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "center",
        render(pharmacy, record, index) {
          return <span>{get(pharmacy, "name")}</span>;
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
      key: "cumulative",
    //   align : "center",
      render(item, record, index) {
        return <ProcessCumulative record={record}/>
      },
    },
    {
      title: "Thưởng",
      dataIndex: "discount",
      key: "discount",
    //   align : "center",
      render(discount, record, index) {
        return <RewardCumulative record={record}/>;
      },
    },
    {
        title: "Nhà cung cấp",
        dataIndex: "supplier",
        key: "supplier",
        render(supplier, record, index) {
          return <span><Typography.Text strong>{get(supplier, "code","")}</Typography.Text> - {get(supplier, "name","")}</span>;
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
              <Typography.Link strong onClick={() => window.open(PATH_APP.bill.root + "?keyword=" + get(item,'codeSequence'))}>
                {get(item, "codeSequence")}
              </Typography.Link>
            ))}
          </Flex>
        );
      },
    },
    
  ];
  if(options?.showVoucher){
    columns.push({
        title: "Phiếu chi",
        dataIndex: "voucher",
        key: "voucher",
        align: "center",
        render(voucher, record: any, index) {
          return (
            voucher ? <Typography.Link onClick={() => onOpenVoucher(get(voucher,'_id'))}>{get(voucher,'codeSequence','')}</Typography.Link> : null
          );
        },
      },)
  }
  if(options?.action){
    columns.push({
        title: "Thao tác",
        dataIndex: "_id",
        key: "action",
        align: "center",
        fixed : 'right',
        render(_id, record: any, index) {
          const { pharmacy,voucher } = record;
          return (
            <Button
              disabled={!!voucher}
              onClick={() => {
                onOpenPayment({
                  totalAmount: getValueOfLk(record),
                  pharmacyId: get(pharmacy, "_id"),
                  method: {
                    data: _id,
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
      },)
  }
  return (
    <div>
      <Row>
        <Col span={6}>
        <billModule.components.SelectPharmacy allowClear showIcon={false} size={'middle'} onChange={(value) => onParamChange({pharmacyId : value})}/>
        </Col>
        <Col span={6}>
        <SearchAnt onParamChange={onParamChange} keyPath='product' placeholder="Tìm mặt hàng..."/>
        </Col>
      </Row>
        <TableAnt 
        loading={isLoading}
        dataSource={data} 
        columns={columns} 
        size="small" 
        pagination={pagingTable(paging,onParamChange)}
        scroll={{x : 1700}}
        />
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
      <Modal
        footer={null}
        open={openVoucher}
        onCancel={onCloseVoucher}
        width={1366}
        destroyOnClose
      >
        <PaymentVoucherForm
          id={idVoucher}
          onClose={onCloseVoucher}
          refCollection={REF_COLLECTION_UPPER.PHARMA_PROFILE}
        />
      </Modal>
    </div>
  );
}
