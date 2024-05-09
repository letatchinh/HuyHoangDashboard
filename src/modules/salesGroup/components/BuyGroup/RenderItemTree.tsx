import { EyeFilled, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
    Col,
    Flex,
    Row,
    Tag,
    Typography
} from "antd";
import { get } from "lodash";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { BuyGroupType } from "../../salesGroup.modal";
import { contextBuyGroup } from "./Context";

export  const RenderItemTree = ({node,onOpen}:{node:{data:BuyGroupType},onOpen:(T:any,P:any)=>void}) => {
  const data: BuyGroupType | undefined = get(node, "data");
  const {setDrawerOpen,setSelectId,setObjSelectId}=contextBuyGroup.useContextBuyGroup
  return (
    <Flex className="item-tree" justify={"space-between"} align={"center"} wrap="nowrap">
      <Flex gap={5} align="center">
        <AvatarShortOrName
          src={get(data, "avatar")}
          name={get(data, "fullName")}
        />
        <Typography.Text
          strong
          onClick={() => onOpen(get(data, "_id"),get(data,'type'))}
        >
          {get(data, "code", "")} - {get(data, "fullName", "")}
        </Typography.Text>
        <Button className="active-by-hover" size="small" onClick={()=>{
          setDrawerOpen(true);
          setSelectId(get(data, "_id"));
          setObjSelectId((obj:any)=>{

            Object.assign(obj,{[get(data, "_id")]:{
              label: data.fullName,
              id:get(data, "_id"),
              targetType: data.type
            }})

            return obj
          })
          }}><EyeFilled/> Chiết khấu</Button>
      </Flex>
      <div style={{ width: "40vw" }}>
        <Row
          gutter={16}
          style={{ width: "100%", boxSizing: "border-box" }}
        >
          <Col span={12}>
            <Tag
              color={
                get(data, "type") === "partner"
                  ? "#2db7f5"
                  : "#108ee9"
              }
            >
              {get(data, "type") === "partner"
                ? "Cộng tác viên"
                : "Trình dược viên"}
            </Tag>
          </Col>
          <Col span={12}>
            <PhoneOutlined style={{ color: "#3481ff" }} />:{" "}
            <Typography.Text copyable>
              {get(data, "phoneNumber")}
            </Typography.Text>
          </Col>
        </Row>
      </div>
    </Flex>
  );
}
