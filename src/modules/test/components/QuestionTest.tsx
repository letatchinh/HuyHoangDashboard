import React, { useState } from "react";
import { FormItem } from "./FormTest";
import { get } from "lodash";
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
  return (
    <FormItem
      shouldUpdate={(acc, re) =>
        get(acc, [ROOT_FIELD, name, "status"]) !==
        get(re, [ROOT_FIELD, name, "status"])
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
          hidden={getFieldValue([ROOT_FIELD, name, "status"]) === "REMOVE"}
          key={key}
          title={<Title name={name} form={form} index={index} />}
        >
          <Content name={name}/>
        </Card>
      )}
    </FormItem>
  );
}

const Content = ({
    name,
}) => {

  return (
    <Flex vertical gap={10}>
        <SelectFolderQuestion name={name}/>
      <Asker name={name}/>
      <ImgDescrpition name={name} />

    </Flex>
  );
};

const Title = ({ form, name, index }) => {
  return (
    <Flex gap={8}>
      <FormItem name={[name, "no"]} noStyle initialValue={index+1}>
        <InputNumber style={{ width: 80, textAlign: "center" }} min={1} />
      </FormItem>
      <FormItem name={[name, "name"]} noStyle>
        <Input />
      </FormItem>
      <FormItem name={[name, "status"]} hidden initialValue={"CURRENT"}>
        <Input />
      </FormItem>
      <Button
        onClick={() =>
          form.setFieldValue([ROOT_FIELD, name, "status"], "REMOVE")
        }
        icon={<DeleteFilled />}
        danger
        type="dashed"
      ></Button>
    </Flex>
  );
};
