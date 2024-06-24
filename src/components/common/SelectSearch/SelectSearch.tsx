import { Button, Col, Radio, Row, Select } from "antd";
import Search from "antd/es/input/Search";
import WithOrPermission from "../WithOrPermission";
import { PlusCircleOutlined } from "@ant-design/icons";
import { OptionSelect, OptionStatus } from "~/constants/defaultValue";

import "./index.scss";
interface Option {
  value: string;
  label: string;
};
interface Props {
  options?: OptionSelect[];
  showSelect?: boolean;
  onSearch?: any;
  optionsStatus?: Option[];
  showSearchStatus?: boolean;
  placeholder?: string;
  isShowButtonAdd?: boolean;
  handleOnClickButton?: any;
  onChange?: any;
  permissionKey?: string[][];
  onSelect?: any;
  onChangeSelect?: any;
  keyword?: any;
  placeholderSelect?: string;
  mode?: "multiple" | "tags" | undefined;
  onChangeStatus?: any;
  valueStatus?: any;
  addComponent?: React.ReactNode;
  style?: React.CSSProperties;
  titleButtonAdd?: string;
}

const SelectSearch = ({
  options,
  showSelect = true,
  onSearch,
  optionsStatus,
  showSearchStatus,
  placeholder = "bất kỳ...",
  placeholderSelect = "Tìm theo nhóm...",
  isShowButtonAdd = false,
  handleOnClickButton,
  onChange,
  onSelect,
  onChangeSelect,
  keyword,
  mode = "multiple",
  onChangeStatus,
  valueStatus,
  permissionKey,
  addComponent,
  style,
  titleButtonAdd = "Thêm mới",
}: Props) => {
  return (
    <div className="select-search" style={{...style}}>
      <div className="select-search__left">
        <Row gutter={5}>
          {showSelect && (
            <Col>
              <Select
                mode={mode}
                style={{
                  width: 300,
                }}
                options={options}
                showSearch
                allowClear
                onChange={onChangeSelect}
                onSelect={onSelect}
                placeholder={placeholderSelect}
              />
            </Col>
          )}
          <Col>
            <Search
              placeholder={`Tìm ${placeholder}`}
              onSearch={onSearch}
              onChange={onChange}
              style={{
                width: 300,
              }}
              allowClear
              enterButton
              value={keyword}
            />
          </Col>
          {showSearchStatus && (
            <Col className="select-search__status">
              <Select
                placeholder="Tìm theo trạng thái"
                style={{
                  width: "150px",
                }}
                options={OptionStatus as any}
                onChange={onChangeStatus}
                showSearch
                allowClear
                // defaultValue={OptionStatus[0]}
              />
            </Col>
          )}
        </Row>
      </div>
      <div className="select-search__right">
        <Row justify="end">
          {addComponent && addComponent}
          {isShowButtonAdd && (
            <Col className="select-search__button">
              <WithOrPermission permission={permissionKey}>
                <Button
                  type="primary"
                  onClick={handleOnClickButton}
                  icon={<PlusCircleOutlined />}
                  style={{ marginLeft: 10 }}
                >
                {titleButtonAdd}
                </Button>
              </WithOrPermission>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default SelectSearch;
