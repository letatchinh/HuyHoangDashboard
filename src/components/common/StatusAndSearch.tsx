import { Col, Row } from "antd";
import React from "react";
import SearchAnt from "../Antd/SearchAnt";
import FIlterStatus from "./FIlterStatus";
type propsType = {
  onParamChange: (obj: any) => void;
  query: any;
  keyword: string;
  setKeyword: any;
  showSearch?: boolean;
  showStatus?: boolean;
};
export default function StatusAndSearch(props: propsType): React.JSX.Element {
  const {
    onParamChange,
    query,
    keyword,
    setKeyword,
    showSearch = true,
    showStatus = true,
  } = props;
  return (
    <Row gutter={16}>
      {showSearch && (
        <Col>
          <SearchAnt
            style={{ alignSelf: "center" }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onParamChange={onParamChange}
          />
        </Col>
      )}

      {showStatus && (
        <Col>
          <FIlterStatus
            onParamChange={onParamChange}
            value={query?.status}
            style={{ border: "1px solid #3481FF", borderRadius: "5px" }}
          />
        </Col>
      )}
    </Row>
  );
}
