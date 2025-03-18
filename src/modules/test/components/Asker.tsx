import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Radio, Select } from "antd";
import React, { createContext, useContext } from "react";
import { FormItem } from "./FormTest";
import { LabelStrong, ROOT_FIELD } from "./QuestionTest";
type propsType = {
  name: number;
};

const initAks = Array.from({ length: 26 }, (_, index) => ({
    alias: String.fromCharCode(65 + index),
    isTrue:false
}))
const Context = createContext({
  name: 0 as number,
  ask_type:'LIST' as 'LIST'|'TEXT'
})

export default function Asker({ name }: propsType): React.JSX.Element {
  const form = Form.useFormInstance();
  const ask_type = Form.useWatch([ROOT_FIELD,name,'ask_type'],form);

  return (
    <Context.Provider value={{
        name,
        ask_type
      }}>
      <Flex vertical gap={6}>
        <Flex align="center" gap={10}>
          <LabelStrong >Đáp án:</LabelStrong>
          <FormItem name={[name,'ask_type']}  noStyle initialValue={'LIST'}>
            <Select 
              // popupMatchSelectWidth={150}
              style={{width:200}}
              variant="underlined"
                options={[
                  {
                    value: 'LIST',
                    label: 'Kiểu Chọn đáp án'
                  },
                  {
                    value: 'TEXT',
                    label: 'Kiểu văn bản'
                  },
                ]}
            />
          </FormItem>
        </Flex>
        <Flex style={{ paddingLeft: 76 ,width:'100%'}}>
          <AskerList/>
          <TextArea/>
        </Flex>
      </Flex>
    </Context.Provider>
  );
}


function AskerList(){
  const { name ,ask_type } = useContext(Context);
  return (
    <Form.List
      name={[name, "ask_list"]}
      initialValue={initAks.slice(0,4)}
    >
      {(fields, { add,remove}) => {
        
        return (
          <Flex vertical style={{width:'100%'}} hidden={ask_type!=='LIST'}>
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
                  alias: initAks[fields.length]?.alias ??'Any',
                })
              }
              icon={<PlusOutlined />}
            >
              Thêm đáp án
            </Button>
          </Flex>
        );
      }}
    </Form.List>
  )
}

function TextArea(){
  const { name ,ask_type } = useContext(Context);
  return (
    <Form.Item name={[name,'ask_text']} hidden={ask_type!=='TEXT'} noStyle>
        <Input.TextArea rows={3} placeholder="Nhập nội dung mẫu"/>
    </Form.Item>
  )
}

Asker.TextArea = TextArea;
Asker.AskerList = AskerList;