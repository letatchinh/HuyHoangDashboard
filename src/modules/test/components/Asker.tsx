import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Radio } from "antd";
import React from "react";
import { FormItem } from "./FormTest";
type propsType = {
  name: number;
};

export default function Asker({ name }: propsType): React.JSX.Element {
  return (
    <Flex vertical>
      <strong>Đáp án:</strong>
      <Flex style={{ paddingLeft: 32 }}>
        <Form.List
          name={[name, "ask"]}
          initialValue={[
            {
              isTrue: false,
              alias: "A",
            },
            {
              isTrue: false,
              alias: "B",
            },
            {
              isTrue: false,
              alias: "C",
            },
            {
              isTrue: false,
              alias: "D",
            },
          ]}
        >
          {(fields, { add,remove }) => {
            return (
              <Flex vertical style={{width:'100%'}}>
                {fields.map((value,index) => {
                  return (
                    <Flex style={{width:'100%'}} gap={10}>
                      <FormItem name={[value.name, "isTrue"]} noStyle>
                        <Checkbox key={value.key}></Checkbox>
                      </FormItem>
                      <FormItem name={[value.name, "alias"]} noStyle>
                        <Input variant="underlined" />
                      </FormItem>
                      <Button type="text" onClick={()=>remove(index)} danger icon={<CloseOutlined/>}></Button>
                    </Flex>
                  );
                })}
                <Button
                  type="text"
                  onClick={() =>
                    add({
                      isTrue: false,
                      alias: "any",
                    })
                  }
                  icon={<PlusOutlined />}
                >
                  Thêm đáp án{" "}
                </Button>
              </Flex>
            );
          }}
        </Form.List>
      </Flex>
    </Flex>
  );
}
