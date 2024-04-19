import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useBillProductSuggestPaging, useGetProductListSuggest } from "../../bill.hook";
import { Button, Card, Carousel, Collapse, List, Popover, Row } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { CollapseProps } from "antd/lib";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import { getCumulativeDiscount, selectProductSearch } from "../../bill.service";
import { get } from "lodash";
import useNotificationStore from "~/store/NotificationContext";
import { formatter } from "~/utils/helpers";
import ImageProduct from "../ImageProduct";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const ProductListSuggest: React.FC = () => {
  const { quotationItems, onAdd, bill } = useCreateBillStore();
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(4)
  const [keyword, setKeyword] = useState("");
  const productSuggest: any = document.querySelector('.product-suggest');
  const tableSelectedProductContent : any = document.querySelector('.table-selected-product .ant-table-content');
  const query = useMemo(
    () => ({
      keyword,
      page: page,
      limit: limit,
      saleOfId : get(bill,'pharmacyId')
    }),
    [page, limit, keyword]
  );
  const [products, isLoading] = useGetProductListSuggest(query);
  const paging = useBillProductSuggestPaging();
  const inputEl : any = useRef(null);

  const { onNotify } = useNotificationStore();
  const [collapseActive, setCollapseActive] = useState(false);

  const handleCollapseChange = () => {
    setCollapseActive(!collapseActive);
  };
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
  function updateMaxHeight() {
    const productSuggestHeight = productSuggest?.offsetHeight;
    const newMaxHeight = 100 - productSuggestHeight;
    if (tableSelectedProductContent) {
      if (collapseActive) {
            tableSelectedProductContent.style.maxHeight = `${newMaxHeight + 10}vh`;
      } else {
            tableSelectedProductContent.style.maxHeight = 'calc(100vh - 50px - 80px)';
        };
    };
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
          xl: 4,
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
              <Popover content={<div style={{width : 120}}>
              <ImageProduct images={get(item,'images',[])}/>
              </div>}>
              <Card
              title={item?.productGroup?.name}
              headStyle={{
                fontSize: 12,
                opacity: disabled ? 0.5 : 1,
              }}
              className="product-suggest__card"
              onScroll={(e) => e.stopPropagation()}
              bodyStyle={{
                width: '100%',
                minWidth: '150px',
                minHeight: '80px',
                maxHeight: '80px',
                padding: 5, 
                overflow: 'hidden',
                fontSize: 12,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <p>{`Tên thuốc: ${item?.name}`}</p>
              <p>{`Giá bán: ${formatter(item?.variants[0]?.price)}`}</p>
              <p>{`NCC: ${item?.supplier?.name ?? ""}`}</p>
            </Card>
              </Popover>
          </List.Item>
        )}}
        />
        <Row align={"middle"} justify={"center"}>
          <Button type="link" icon={<CaretLeftOutlined className="product-suggest__btn--icon" />} disabled={ !paging?.hasPrevPage } onClick={()=> onChangeData(false)}/>
          <Button type="link" icon={<CaretRightOutlined className="product-suggest__btn--icon"  />} disabled={ !paging?.hasNextPage} onClick={()=> onChangeData(true)} />
      </Row>
      </>
    )
  };
  const getItems: (panelStyle?: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
      key: '1',
      label: 'Danh sách thuốc gợi ý',
      children: <ListItem />,
      // onClick: () => {
      //   updateMaxHeight();
      //   window.addEventListener('resize', updateMaxHeight);
      // },
      // style: panelStyle,
    },
  ];
  return (
    <div className="product-suggest">
      <div className="product-suggest__content">
        <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={getItems()}
          onChange={handleCollapseChange}
          accordion
          defaultActiveKey={["1"]}
      />
      </div>
    </div>
  );
};
export default ProductListSuggest;
