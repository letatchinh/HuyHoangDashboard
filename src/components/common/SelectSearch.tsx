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
  optionsStatus?: [Option] | [],
  showSearchStatus?: boolean,
  placeholder?: string
};

const SelectSearch = ({ options, showSelect = true, onSearch, optionsStatus,showSearchStatus, placeholder = 'bất kỳ...'}: Props) => {
  
  return (
    <Row gutter={5} style={{marginBottom: 10}}>
      {showSelect && <Col span={8}>
        <Select
          style={{
           width: '100%'
         }}
          options={options}
          showSearch
          allowClear
        />
      </Col>}
      <Col span={8}>
        <Search
          placeholder= {`Tìm ${placeholder}`}
          onSearch={onSearch}
          allowClear
        />
      </Col>
    {showSearchStatus &&  <Col span={8}>
        <Select
          placeholder="Tìm theo trạng thái"
          style={{
            width: '100%'
          }}
           options={optionsStatus}
           showSearch
           allowClear
        />
      </Col>}
    </Row>
  );
};

export default SelectSearch;
