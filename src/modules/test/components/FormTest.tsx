import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  GetProps,
  Input,
  Row,
  Select,
} from "antd";
import React, { PropsWithChildren } from "react";
import { Context } from "../context";
import StatusTestLine from "./StatusTestLine";
import dayjs from "dayjs";
import WhiteBox from "~/components/common/WhiteBox";
import { PlusSquareOutlined } from "@ant-design/icons";
import QuestionTest, { ROOT_FIELD } from "./QuestionTest";
import { FolderQuestion } from "./SelectFolderQuestion";
type propsType = {};
export default function FormTest(props: propsType): React.JSX.Element {
  const { form } = Context.useCreate();

  return (
    <FormStyle form={form}>
        <FormItem hidden name={'assetKey'}><Input value={'key_test_module_test'}/></FormItem>
      <WhiteBox title="Thông tin">
        <RenderRow>
          <RenderRow.Col>
            <FormItem label="Tên bộ đề:">
              <Input />
            </FormItem>
          </RenderRow.Col>

          <RenderRow.Col>
            <FormItem label="Hình thức:">
              <Select
                options={[
                  {
                    value: "LISTENING-READING",
                    label: "Nghe - Đọc",
                  },
                  {
                    value: "SPEAKING-WRITING",
                    label: "Nói - viết",
                  },
                ]}
              />
            </FormItem>
          </RenderRow.Col>
        </RenderRow>
        <Divider variant="solid"></Divider>

        <RenderRow>
          <RenderRow.Col>
            <FormItem label="Trạng thái:" layout="horizontal">
              <StatusTestLine status="ACTIVE" />
            </FormItem>
          </RenderRow.Col>

          <RenderRow.Col>
            <FormItem label="Ngày tạo:" layout="horizontal">
              <Input
                variant="filled"
                readOnly
                value={dayjs().format("DD/MM/YYYY HH:mm:ss")}
              />
            </FormItem>
          </RenderRow.Col>
        </RenderRow>

        <RenderRow.Col>
          <FormItem label="Đối tượng áp đụng:" name={"role"}>
            <Select
              defaultValue={"FREE"}
              options={[
                {
                  label: "Miễn phí",
                  value: "FREE",
                },
                {
                  label: "Học viên",
                  value: "MEMBER",
                },
              ]}
            ></Select>
          </FormItem>
        </RenderRow.Col>
      </WhiteBox>

      <WhiteBox title="Câu hỏi" style={{backgroundColor:'rgb(240 244 251)'}}>
        <FolderQuestion>
          <Form.List name={"questions"}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name }, index) => {
                    return (
                      <QuestionTest key={key} name={name} form={form} index={index}/>
                    );
                  })}

                  <Button
                  style={{
                    position:'sticky',
                    bottom:0
                  }}
                    onClick={() => {
                      setTimeout(()=>{
                        form.scrollToField([ROOT_FIELD, fields.length, 'name'], {
                          behavior: 'smooth',
                          inline: 'center',
                          block:'center',
                          scrollMode:'always',
                          focus:true,
                        })

                      },50)
                      add({ name: "Câu hỏi", }) 
                    }}
                    type="primary"
                    icon={<PlusSquareOutlined />}
                  >
                    Thêm câu hỏi
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FolderQuestion>
      </WhiteBox>
    </FormStyle>
  );
}

export const RenderRow = (prps: PropsWithChildren) => {
  return (
    <Row style={{ width: "100%" }} gutter={10}>
      {prps.children}
    </Row>
  );
};

RenderRow.Col = function RenderCol(prps: PropsWithChildren) {
  return (
    <Col md={{ span: 24 }} lg={{ span: 12 }}>
      {prps.children}
    </Col>
  );
};

export const FormItem = (props: GetProps<typeof Form.Item>) => {
  return (
    <Form.Item
      {...{
        layout: "vertical",
        ...props,
      }}
    />
  );
};
const FormStyle = (props: GetProps<typeof Form>) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 34,
          },
        },
      }}
    >
      <Form {...props}>{props.children}</Form>
    </ConfigProvider>
  );
};
