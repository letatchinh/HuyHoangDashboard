import React, { useMemo, useState } from 'react';
import { useFetchState } from '~/utils/helpers';
import apis from '../supplier.api';
import { Col, Form, Row, Select, Spin } from 'antd';
import BaseBorderBox from '~/components/common/BaseBorderBox';
type propsType = {
  setRankingId?: any;
  rankingId?: any;
};

export default function RankingSupplier({rankingId, setRankingId}: propsType): React.JSX.Element {
  const [data, loading] = useFetchState({ api: apis.getRanking, useDocs: false });
  const options = useMemo(() => data?.map((item: any) => ({ label: item?.name, value: item?._id })), [data])
  return (
    <BaseBorderBox title={"Xếp hạng"}>
      <Row justify={"space-between"} align="middle" gutter={48}>
        <Col span={12}>
          <Form.Item label="Hạng nhà cung cấp">
            {loading ? <Spin /> : <Select value={rankingId} options={options} onChange={(e) => { 
              setRankingId(e);
            }} />}
          </Form.Item>
        </Col>
      </Row>
    </BaseBorderBox>
  );
};