import React, { useState } from "react";
import { Context } from "../context";
import { ROOT_FIELD } from "./QuestionTest";
import { Button, Flex, message, Upload } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { FormItem } from "./FormTest";
import { get } from "lodash";
type propsType = {
  name: number;
  pathTo:(...p:(string|number)[])=>(string|number)[] 
};
export default function ImgaDescrpition({
  name,
  pathTo
}: propsType): React.JSX.Element {
  const { form, getAssetKey } = Context.useCreate();

  const handleUpload = (file) => {
    const gifPreviewUrl = URL.createObjectURL(file);
    form.setFieldValue([ROOT_FIELD, name, "image", ], {
      url : gifPreviewUrl,
      name: file.name,
    });
    message.success(`${file.name} file uploaded successfully.`);
    return false;
  };
  const getValueUpdate= (A)=>get(A,pathTo('image','url'));
  
  return (
    <Flex vertical gap={8}>
      <FormItem hidden name={[name, "image", "url"]}></FormItem>
      <FormItem hidden name={[name, "image", "name"]}></FormItem>
      <strong>Ảnh minh hoạ:</strong>
      <div
        style={{
          position: "relative",
          maxHeight: 300,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          minHeight: 32,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Upload
            style={{ marginTop: 0 }}
            customRequest={({ file, onSuccess, onError }) => {
              try {
                handleUpload(file);
                onSuccess("ok");
              } catch (error) {
                onError(error);
              }
            }}
            showUploadList={false}
            accept="image/*"
          >
            <Button type="dashed"  style={{width:190}} icon={<UploadOutlined />}>Tải lên ảnh minh hoạ</Button>
          </Upload>
        </div>
        <FormItem shouldUpdate={(A,B)=>getValueUpdate(A)!==getValueUpdate(B)} noStyle>
          {
            ({getFieldValue})=>{
              return getFieldValue(pathTo('image','url')) && (
                <>
                  <Button
                    style={{ position: "absolute", top: 0, right: 0 }}
                    danger
                    type={"dashed"}
                    icon={<CloseOutlined />}
                    onClick={() => {
                      form.setFieldValue(pathTo('image'),{
                        url:'',
                        name:''
                      })
                    }}
                  />
                  <img
                    src={form.getFieldValue(pathTo('image','url'))}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </>
              )
            }
          }
        </FormItem>
      </div>
    </Flex>
  );
}
