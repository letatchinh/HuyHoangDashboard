import { Col, Row, Select } from "antd";
import Search from "antd/es/input/Search";


interface Option {
  value: string;
  label: string;
};
interface Props {
  options?: [Option] | [],
  showSelect?: boolean,
  onSearch?: any,
};

const SelectSearch = ({ options, showSelect = true, onSearch}: Props) => {
  
  return (
    <Row gutter={5}>
      {showSelect && <Col span={8}>
        <Select
          style={{
           width: '100%'
         }}
          options={options}
          showSearch
          placeholder="Tìm..."
          allowClear
        />
      </Col>}
      <Col span={8}>
        <Search
          placeholder="Tìm..."
          onSearch={onSearch}
          allowClear
        />
      </Col>
    </Row>
  );
};

export default SelectSearch;
