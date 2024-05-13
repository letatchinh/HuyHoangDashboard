import { ArrowRightOutlined } from "@ant-design/icons";
import { Flex, Select } from "antd";
type PropsType = {};
function Control(props: PropsType): React.JSX.Element {
    return <div>
      <Flex align={'center'}>
        <Select placeholder="Người muốn chuyển"/>
        <ArrowRightOutlined />
        <Select placeholder="Nhóm muốn đến"/>
      </Flex>
    </div>;
  }
  
  export default {
    Control,
  };
  