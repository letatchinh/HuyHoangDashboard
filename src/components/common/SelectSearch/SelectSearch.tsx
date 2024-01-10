import { Button, Col, Row, Select } from "antd";
import Search from "antd/es/input/Search";
// import WithOrPermission from "../WithOrPermission";
// import POLICY from "../../../modules/policy/policy.auth";
import { PlusCircleOutlined } from "@ant-design/icons";
import './index.scss'
interface Option {
  value: string;
  label: string;
}
interface Props {
  options?: [Option] | [];
  showSelect?: boolean;
  onSearch?: any;
  optionsStatus?: [Option] | [];
  showSearchStatus?: boolean;
  placeholder?: string;
  isShowButtonAdd?: boolean;
  handleOnClickButton?: any;
  onChange?: any;
  permissionKey?: any
  onChangeSelect?: any
  onSelect?: any
}

const SelectSearch = ({
  options,
  showSelect = true,
  onSearch,
  optionsStatus,
  showSearchStatus,
  placeholder = "bất kỳ...",
  isShowButtonAdd = false,
  handleOnClickButton,
  onChange,
  onChangeSelect,
  onSelect,
  permissionKey
}: Props) => {
  return (
  <div className="select-search">
      <div className="select-search__left">
      <Row gutter={5}>
          {showSelect && (
            <Col span={8}>
              <Select
                style={{
                  width : 300
                }}
                options={options}
                showSearch
                allowClear
                onChange={onChangeSelect}
                onSelect={onSelect}
              />
            </Col>
          )}
          <Col span={8}>
            <Search
              placeholder={`Tìm ${placeholder}`}
              onSearch={onSearch}
              onChange={onChange}
              style={{
                width : 300
              }}
              allowClear
              enterButton
            />
          </Col>
          {showSearchStatus && (
            <Col span={8}>
              <Select
                placeholder="Tìm theo trạng thái"
                style={{
                  width: "100%",
                }}
                options={optionsStatus}
                showSearch
                allowClear
              />
            </Col>
          )}
        </Row>
    </div>
      <div className="select-search__right">
      <Row gutter={5} justify='end'>
          {isShowButtonAdd && (
            <Col  className="select-search__button">
               {/* <WithOrPermission permission={[permissionKey]} >  */}
              <Button
                type="primary"
                onClick={handleOnClickButton}
                icon={<PlusCircleOutlined/>}
              >
                Thêm mới
              </Button>
              {/* </WithOrPermission>  */}
            </Col>
          )}
        </Row>
    </div>
  </div>
  );
};

export default SelectSearch;


