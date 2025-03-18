import React, { CSSProperties, PropsWithChildren, useState } from "react";
import { FormItem } from "./FormTest";
import { defaultTo, get } from "lodash";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Upload,
} from "antd";
import { CloseOutlined, DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { Context } from "../context";
import ImgDescrpition from "./ImgDescrpition";
import Asker from "./Asker";
import SelectFolderQuestion from "./SelectFolderQuestion";
import AudioDescription from "./AudioDescription";
type propsType = {
  name: number;
  key: number;
  form: ReturnType<typeof Form.useForm>[0];
  index: number;
};

export const ROOT_FIELD = "questions";
export default function QuestionTest({
  name,
  key,
  form,
  index,
}: propsType): React.JSX.Element {

    const pathTo=(...fields)=>[ROOT_FIELD, name, ...fields]
  return (
    <FormItem
      shouldUpdate={(acc, re) =>
        get(acc, pathTo( "status")) !==
        get(re,  pathTo( "status"))
      }
      noStyle
    >
      {({ getFieldValue }) => (
        <Card
          style={{
            marginBottom: 10,
          }}
          styles={{
            header: {
              padding: 6,
              minHeight: "unset",
            },
          }}
          hidden={getFieldValue( pathTo( "status")) === "REMOVE"}
          key={key}
          title={<Title name={name} form={form} index={index} pathTo={pathTo} />}
        >
          <Content name={name} pathTo={pathTo}/>
        </Card>
      )}
    </FormItem>
  );
}

const Content = ({
    name,
    pathTo
}) => {

  return (
    <Flex vertical gap={10}>
      <SelectFolderQuestion name={name}/>
      <Asker name={name}/>
      <AudioDescription name={name}/>
      <ImgDescrpition pathTo={pathTo} name={name} />

    </Flex>
  );
};

const Title = ({ form, name, index, pathTo }) => {
  return (
    <Flex gap={8}>
        <Flex align="center" gap={8}>
            <strong>Câu: </strong>
            <FormItem name={[name, "no"]} noStyle initialValue={index+1}>
                <InputNumber style={{ width: 70, textAlign: "center" }} min={1} variant="underlined" />
            </FormItem>
        </Flex>
      <FormItem name={[name, "name"]} noStyle>
        <Input />
      </FormItem>
      <FormItem name={[name, "status"]} hidden initialValue={"CURRENT"}>
        <Input />
      </FormItem>
      <Button
        onClick={() =>
          form.setFieldValue(pathTo( "status"), "REMOVE")
        }
        icon={<DeleteFilled />}
        danger
        type="dashed"
      ></Button>
    </Flex>
  );
};

export const LabelStrong=(props:PropsWithChildren<{style?:CSSProperties}>)=>{
  return <strong style={{width: 64,...defaultTo(props.style,{})}}>{props.children}</strong>
}
