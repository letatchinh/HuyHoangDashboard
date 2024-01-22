import React, { CSSProperties, useMemo, useState } from "react";
import { useGetProductListSuggest } from "../../bill.hook";
import { Button, Card, Carousel, Collapse, List, Row } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { CollapseProps } from "antd/lib";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

type propsType = {};
const ProductListSuggest: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const query = useMemo(
    () => ({
      keyword: "",
      page:page ,
      limit: limit,
    }),
    [page, limit]
  );
  const [products, isLoading] = useGetProductListSuggest(query);
  console.log(products,'products')
  const productsConfig = [
    {
      title: "Title 1",
    },
    {
      title: "Title 2",
    },
    {
      title: "Title 3",
    },
    {
      title: "Title 4",
    },
    {
      title: "Title 5",
    },
    {
      title: "Title 3",
    },
    {
      title: "Title 4",
    },
    {
      title: "Title 5",
    },
  ];

  const onChangeData = (e: boolean) => {
    if (e) {
      setPage(page + 1);
      setLimit(limit + 10);
    } else {
      setPage(page - 1);
      setLimit(limit - 10);
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
          xl: 6,
          xxl: 3,
        }}
        dataSource={products?.docs || []}
        renderItem={(item: any) => (
          <List.Item
            className="product-suggest__item"
            onClick={() => console.log(item)}
          >
            <Card
              title={item?.productGroup?.name}
              headStyle={{
                fontSize: 12,
              }}
              onScroll={(e) => e.stopPropagation()}
              bodyStyle={{
                width: '100%',
                minWidth: '100px',
                minHeight: '100px',
                // height: 'max-content',
                padding: 5, 
                overflow: 'hidden',
                fontSize: 12,
              }}
            >
              <p>{`- ${item?.name}`}</p>
              <p>{`- ${item?.variants[0]?.price}`}</p>
              <p>{`Ncc: ${item?.manufacturer?.name}`}</p>
            </Card>
          </List.Item>
        )}
        />
        <Row align={"middle"} justify={"center"}>
          <Button type="link" icon={<CaretLeftOutlined />} disabled={!products?.length ?? page === 1} />
          <Button type="link" icon={<CaretRightOutlined />} disabled={ !products?.length ?? products?.length < 10 ?? products?.totalDocs/10 < page} />
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
