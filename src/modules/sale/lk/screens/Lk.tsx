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
// const dataSource = [
//   {
//     name: "Thuốc A",
//     pharmacy: {
//       _id: "65bb176c7f8c1b44dc90d44f",
//       phoneNumber: "0911023458",
//       name: "Nhà thuốc 224",
//       branchId: 99999,
//       address: {
//         street: "2345 Thi Sách",
//         wardId: "20245",
//         districtId: "492",
//         cityId: "48",
//       },
//       code: "NT00004",
//       infoPolicy: {
//         fullName: "224",
//       },
//       status: "ACTIVE",
//       slug: "nha-thuoc-224-750",
//       createdAt: "2024-02-01T04:00:44.397Z",
//       updatedAt: "2024-02-01T08:51:35.076Z",
//       __v: 0,
//       resultDebt: 0,
//     },
//     cumulativeDiscount: {
//       name: "LK A",
//     },
//     bills: [
//       {
//         code: "BILL0001",
//         totalAmount: 10000,
//       },
//       {
//         code: "BILL0002",
//         totalAmount: 20000,
//       },
//     ],
//     totalAmount: 100000,
//     session_id: "T1_123132123",
//   },
// ];
const dataSource = [
  {
    _id: "65b89d008adfd6cfdaf75759",
    product: {
      _id: "65bb464a77e2de623eb1b98e",
      manufacturerId: "65bb0cda7f8c1b44dc90ce5b",
      productGroupId: "65bb45ab7f8c1b44dc90df22",
      productDetail: { country: 230 },
      name: "MEDICRAFTS NATURAL VITAMIN E 400 IU",
      type: "agency",
      supplierId: "65bb150e7f8c1b44dc90d32b",
      slug: "MEDICRAFTS NATURAL VITAMIN E 400 IU",
      branchId: 99999,
      codeBySupplier: "ML5-M117990",
      createdAt: "2024-02-01T07:20:42.628Z",
      updatedAt: "2024-02-01T07:20:42.628Z",
      __v: 0,
    },
    discount: {
      _id: "65bb464a77e2de623eb1b993",
      condition: { gte: 0, lte: 1000000, isRanger: true },
      typeReward: "VALUE",
      timesReward: null,
      value: 3,
      name: "CK3",
      valueType: "PERCENT",
      target: "product",
      targetId: "65bb464a77e2de623eb1b98e",
      typeDiscount: "LK",
      status: "ACTIVE",
      cumuSession: {
        gte: "2024-02-01T00:00:00.000Z",
        lte: "2024-02-29T23:59:59.000Z",
        session_id: "T_2_65bb464a77e2de623eb1b993",
      },
    },
    bills: [{ codeSequence: "DH10012", totalAmount: 1554930 }],
    totalCumulative: 1554930,
    pharmacy: {
      _id: "65b89d008adfd6cfdaf75759",
      phoneNumber: "0974635874",
      name: "Nhà thuốc Nguyên Ngọc",
      branchId: 99999,
      address: {
        street: "10 Nại Hiên Đông 20",
        wardId: "20266",
        districtId: "493",
        cityId: "48",
      },
      code: "NT00001",
      infoPolicy: {
        fullName: "Nguyễn Ngọc Uyên",
        email: "mtna.2302@gmail.com",
      },
      status: "ACTIVE",
      slug: "nha-thuoc-nguyen-ngoc-437",
      createdAt: "2024-01-30T06:53:52.790Z",
      updatedAt: "2024-02-02T13:43:18.571Z",
      __v: 0,
    },
  },
  {
    _id: "65b8a0b88adfd6cfdaf75784",
    product: {
      _id: "65bcaa8529ec1bd89387ef64",
      manufacturerId: "65bc4e9b483e0889a5e622fa",
      productGroupId: "65b859d6748cf086cbb903d4",
      medicalCode: "DQG00100331",
      productDetail: {
        package: "hộp 1 chai 60 ml; hộp 1 chai 120 ml",
        element:
          "Mỗi ml cao lỏng chứa các chất chiết được từ dược liệu tương đương: Húng chanh 500 mg; Núc nác 125 mg; Cineol 0,883 mg",
        country: 230,
      },
      name: "Thuốc ho Astemix",
      type: "exclusive",
      supplierId: "65bb14067f8c1b44dc90d22a",
      slug: "Thuoc ho Astemix",
      branchId: 99999,
      codeBySupplier: "AHN025701",
      createdAt: "2024-02-02T08:40:37.533Z",
      updatedAt: "2024-02-02T08:42:44.404Z",
      __v: 0,
    },
    discount: {
      _id: "65bcab0429ec1bd89387efb8",
      condition: { gte: 0, isRanger: false },
      typeReward: "VALUE",
      timesReward: 1,
      value: 25,
      name: "Chiết khấu lũy kế năm 2024",
      valueType: "PERCENT",
      target: "product",
      targetId: "65bcaa8529ec1bd89387ef64",
      typeDiscount: "LK",
      status: "ACTIVE",
      cumuSession: {
        gte: "2024-02-01T00:00:00.000Z",
        lte: "2024-02-29T23:59:59.000Z",
        session_id: "T_2_65bcab0429ec1bd89387efb8",
      },
    },
    bills: [{ codeSequence: "DH10021", totalAmount: 2992500 }],
    totalCumulative: 2992500,
    pharmacy: {
      _id: "65b8a0b88adfd6cfdaf75784",
      phoneNumber: "0986954444",
      name: "Nhà thuốc Merry",
      branchId: 99999,
      address: {
        street: "23 Nguyễn Phước Lan",
        wardId: "20008",
        districtId: "480",
        cityId: "46",
      },
      code: "NT00002",
      infoPolicy: { fullName: "Lê Ngọc Hoài" },
      status: "ACTIVE",
      slug: "nha-thuoc-merry-815",
      createdAt: "2024-01-30T07:09:44.775Z",
      updatedAt: "2024-02-02T07:15:32.028Z",
      __v: 0,
    },
  },
  {
    _id: "65bb17097f8c1b44dc90d442",
    product: {
      _id: "65bcaa8529ec1bd89387ef64",
      manufacturerId: "65bc4e9b483e0889a5e622fa",
      productGroupId: "65b859d6748cf086cbb903d4",
      medicalCode: "DQG00100331",
      productDetail: {
        package: "hộp 1 chai 60 ml; hộp 1 chai 120 ml",
        element:
          "Mỗi ml cao lỏng chứa các chất chiết được từ dược liệu tương đương: Húng chanh 500 mg; Núc nác 125 mg; Cineol 0,883 mg",
        country: 230,
      },
      name: "Thuốc ho Astemix",
      type: "exclusive",
      supplierId: "65bb14067f8c1b44dc90d22a",
      slug: "Thuoc ho Astemix",
      branchId: 99999,
      codeBySupplier: "AHN025701",
      createdAt: "2024-02-02T08:40:37.533Z",
      updatedAt: "2024-02-02T08:42:44.404Z",
      __v: 0,
    },
    discount: {
      _id: "65bcab0429ec1bd89387efb8",
      condition: { gte: 0, isRanger: false },
      typeReward: "VALUE",
      timesReward: 1,
      value: 25,
      name: "Chiết khấu lũy kế năm 2024",
      valueType: "PERCENT",
      target: "product",
      targetId: "65bcaa8529ec1bd89387ef64",
      typeDiscount: "LK",
      status: "ACTIVE",
      cumuSession: {
        gte: "2024-02-01T00:00:00.000Z",
        lte: "2024-02-29T23:59:59.000Z",
        session_id: "T_2_65bcab0429ec1bd89387efb8",
      },
    },
    bills: [{ codeSequence: "DH10024", totalAmount: 897750 }],
    totalCumulative: 897750,
    pharmacy: {
      _id: "65bb17097f8c1b44dc90d442",
      phoneNumber: "0911196474",
      name: "Nhà thuốc Liên Minh",
      branchId: 99999,
      address: {
        street: "1 Thanh Khê",
        wardId: "20206",
        districtId: "491",
        cityId: "48",
      },
      code: "NT00003",
      infoPolicy: { fullName: "Mai Ngọc" },
      status: "ACTIVE",
      slug: "nha-thuoc-lien-minh-957",
      createdAt: "2024-02-01T03:59:05.428Z",
      updatedAt: "2024-02-01T03:59:05.428Z",
      __v: 0,
    },
  },
];
console.log(dataSource, "dataSource");

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
      title: "Chương trình luỹ kế",
      dataIndex: "discount",
      key: "discount",
      render(discount, record, index) {
        return <span>{get(discount, "name")}</span>;
      },
    },
    {
      title: "Đã tích luỹ",
      dataIndex: "discount",
      key: "discount",
      render(discount, record, index) {
        return <span>{formatter(get(discount,'totalCumulative',get(record,'totalCumulative',0)))}</span>;
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
                {get(item, "codeSequence")}
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
      render(_id, record: any, index) {
        const { actualClamp, pharmacy, session_id } = record;
        return (
          <Button
            disabled={true}
            onClick={() => {
              onOpenPayment({
                totalAmount: actualClamp,
                pharmacyId: get(pharmacy, "_id"),
                method: {
                  data: {
                    session_id,
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
