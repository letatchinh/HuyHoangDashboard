import { DownOutlined } from "@ant-design/icons";
import { Button, Flex, List, Popover } from "antd";
import Search from "antd/es/input/Search";
import { debounce, get } from "lodash";
import React, { useCallback, useState } from "react";
type propsType = {
  dataSource: { value: any; label: any }[];
  isLoading?: boolean;
  onChange: (value: any) => void;
  title?: any;
  onSearch: (value: any) => void;
};
export default function SearchList({
  dataSource,
  isLoading,
  onChange,
  title,
  onSearch,
}: propsType): React.JSX.Element {
  const debounceFetcher = debounce(onSearch, 300);
  const [open, setOpen] = useState(false);
  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <>
          <Search
            onSearch={(value) => onSearch(value)}
            onChange={({ target }) => debounceFetcher(target.value)}
          />
          <List
            className="scrollList"
            style={{ width: 300 }}
            dataSource={dataSource}
            loading={isLoading}
            renderItem={(item) => (
              <List.Item key={get(item, "value")}>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  title={<span>{get(item, "label", "")}</span>}
                />
                <Button
                  onClick={() => {
                    onChange(get(item, "value"));
                    hide();
                  }}
                  type="link"
                >
                  Chọn
                </Button>
              </List.Item>
            )}
          />
        </>
      }
      title={title && title}
      trigger="click"
      placement="bottom"
    >
      <Button>
        <Flex align={'center'} justify='space-between' gap={10}>
        Chọn yêu cầu chuyển nhóm
        <DownOutlined />
        </Flex>
      </Button>
    </Popover>
  );
}
