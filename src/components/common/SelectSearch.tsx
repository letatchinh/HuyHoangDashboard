import { Button, Col, Row, Select } from "antd";
import Search from "antd/es/input/Search";
import WithOrPermission from "./WithOrPermission";
import POLICY from "../../modules/policy/policy.auth";

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
  permissionKey
}: Props) => {
  return (
  <div className="select-search">
      <div className="select-search__right">
      <Row gutter={5}>
          {showSelect && (
            <Col span={8}>
              <Select
                style={{
                  width: "100%",
                }}
                options={options}
                showSearch
                allowClear
              />
            </Col>
          )}
          <Col span={8}>
            <Search
              placeholder={`Tìm ${placeholder}`}
              onSearch={onSearch}
              onChange={onChange}
              allowClear
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
      <div className="select-search__left">
      <Row gutter={5}>
          <Col span={18}></Col>
          {isShowButtonAdd && (
            <Col span={4} className="select-search__button">
              <WithOrPermission permission={[permissionKey]} >
              <Button
                style={{ marginBottom: 10 }}
                type="primary"
                onClick={handleOnClickButton}
              >
                Thêm mới
              </Button>
              </WithOrPermission>
            </Col>
          )}
        </Row>
    </div>
    {/* <Row gutter={5} style={{ marginBottom: 10 }}>
      <Col span={16}>
        <Row gutter={5}>
          {showSelect && (
            <Col span={8}>
              <Select
                style={{
                  width: "100%",
                }}
                options={options}
                showSearch
                allowClear
              />
            </Col>
          )}
          <Col span={8}>
            <Search
              placeholder={`Tìm ${placeholder}`}
              onSearch={onSearch}
              allowClear
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
      </Col>
      <Col span={8}>
        <Row gutter={5}>
          <Col span={18}></Col>
          {isShowButtonAdd && (
            <Col span={4} className="select-search__button">
              <Button
                style={{ marginBottom: 10 }}
                type="primary"
                onClick={handleOnClickButton}
              >
                Thêm mới
              </Button>
            </Col>
          )}
        </Row>
      </Col>
    </Row> */}
  </div>
  );
};

export default SelectSearch;
