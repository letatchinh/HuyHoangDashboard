import { Checkbox, Col, Flex, List, Row, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import BaseBorderBox from '~/components/common/BaseBorderBox';
import SelectProductGroups from '~/modules/productGroup/screens/SelectProductGroup';
import {useGetProducts, useProductQueryParams, useUpdateProductParams } from '../../product.hook';
import Search from 'antd/es/input/Search';
import { useFetchState } from '~/utils/helpers';
import apis from '../../product.api';
type propsType = {

}
export default function FormSelectProduct(props: propsType): React.JSX.Element {
  const [keyword, setKeyword] = useState<string>('');
  const newQuery = useMemo(() => ({
    page: 1,
    limit: 200,
    isSupplierMaster: true,
    keyword
  }), [keyword]);
  const [products, isLoading] = useFetchState({ api: apis.getAll, useDocs: true, query: newQuery });
  const [productIds, setProductIds] = useState<string[]>([]);

  return (
    <div style={{maxHeight: '90vh', overflow: 'hidden'}}>
      <Space>
        <div>Chọn nhóm sản phẩm:</div>
        <SelectProductGroups style={{width: '400px'}}/>
      </Space>
      <BaseBorderBox title={'Danh sách sản phẩm'} styleContent={{ minHeight: '700px',height: '100%'}}>
        <Row gutter={36}>
          <Col span={12}>
            <BaseBorderBox title={'Danh sách sản phẩm sẵn sàng'} styleContent={{ minHeight: '600px',height: '70%', maxHeight: '600px'}}>
              <div>
                <Search
                  style={{
                    position: 'sticky',
                  }}
                  placeholder='Tìm sản phẩm'
                  onSearch={setKeyword}
                  allowClear
                  onChange={(e: any) => {
                    if(e === '') setKeyword(e.target.value)
                  }}
                />
              </div>
              <List style={{overflowY: 'auto', height: '550px'}}>
                {products?.map((item: any) => (
                  <Flex gap={12}>
                    <Checkbox onClick={(e: any) => {
                      if(e.target.checked) {
                        setProductIds([...productIds, item?._id])
                      } else {
                        setProductIds(productIds.filter((i: string) => i !== item?._id))
                      };
                    }}/>
                    <List.Item>{item?.name}</List.Item>
                  </Flex>
                ))}
              </List>
            </BaseBorderBox>
          </Col>
          <Col span={12}>
            <BaseBorderBox title={'Danh sách sản phẩm đã chọn'}  styleContent={{ minHeight: '600px', maxHeight: '70%' ,height: '600px'}}>
              <></>
            </BaseBorderBox>
          </Col>
        </Row>
      </BaseBorderBox>
    </div>
  )
}