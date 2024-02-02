import React, { CSSProperties, useMemo, useRef, useState } from "react";
import { useBillProductSuggestPaging, useGetProductListSuggest } from "../../bill.hook";
import { Button, Card, Carousel, Collapse, List, Row } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { CollapseProps } from "antd/lib";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import { getCumulativeDiscount, selectProductSearch } from "../../bill.service";
import { get } from "lodash";
import useNotificationStore from "~/store/NotificationContext";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const ProductListSuggest: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [keyword, setKeyword] = useState("");
  const query = useMemo(
    () => ({
      keyword,
      page: page,
      limit: limit,
    }),
    [page, limit, keyword]
  );
  const [products, isLoading] = useGetProductListSuggest(query);
  const paging = useBillProductSuggestPaging();
  const inputEl : any = useRef(null);
  const { quotationItems, onAdd, bill } = useCreateBillStore();
  const {onNotify} = useNotificationStore();
  const onSelect = async(data:any) => {
    // inputEl.current.blur();
    const billItem: any = selectProductSearch(data);
    const cumulativeDiscount = await getCumulativeDiscount({pharmacyId : get(bill,'pharmacyId'),quotationItems : [billItem]});
    const billItemWithCumulative = {
      ...billItem,
      cumulativeDiscount: cumulativeDiscount?.[get(billItem, 'productId')] ?? []
    };
    onAdd(billItemWithCumulative)
  };

  const onChangeData = (e: any) => {
    if (e) {
      setPage(paging?.current + 1)
    } else {
      setPage(paging?.current - 1)
    }
  };
  const ListItem = () => {
    return (
      <>
        <List
        className="product-suggest__list"
        grid={{
          gutter: 12,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={products?.docs || []}
          renderItem={(item: any) => {
            const disabled = quotationItems?.find((billItem: any) => billItem?.productId === item?._id) ? true : false;
          return (
          <List.Item
            className={`product-suggest__item`}
              onClick={() => {
                if (disabled) {
                  onNotify?.warning("Đã chọn sản phẩm này")
                } else {
                  onSelect(item);
              }
              }}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
          >
              <Card
              title={item?.productGroup?.name}
              headStyle={{
                fontSize: 12,
                opacity: disabled ? 0.5 : 1,
              }}
              onScroll={(e) => e.stopPropagation()}
              bodyStyle={{
                width: '100%',
                minWidth: '100px',
                minHeight: '100px',
                padding: 5, 
                overflow: 'hidden',
                fontSize: 12,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <p>{`- ${item?.name}`}</p>
              <p>{`- ${item?.variants[0]?.price}`}</p>
              <p>{`Ncc: ${item?.manufacturer?.name}`}</p>
            </Card>
          </List.Item>
        )}}
        />
        <Row align={"middle"} justify={"center"}>
          <Button type="link" icon={<CaretLeftOutlined />} disabled={ !paging?.hasPrevPage } onClick={()=> onChangeData(false)}/>
          <Button type="link" icon={<CaretRightOutlined />} disabled={ !paging?.hasNextPage} onClick={()=> onChangeData(true)} />
      </Row>
      </>
    )
  };
  const getItems: (panelStyle?: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
      key: '1',
      label: 'Danh sách thuốc gợi ý',
      children: <ListItem/>,
      // style: panelStyle,
    },
  ];
  return (
    <div className="product-suggest">
      <Collapse
        bordered={false}
        // defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={getItems()}
      />
    </div>
  );
};
export default ProductListSuggest;
