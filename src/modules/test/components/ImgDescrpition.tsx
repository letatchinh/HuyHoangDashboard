import React, { useState } from "react";
import { Context } from "../context";
import { ROOT_FIELD } from "./QuestionTest";
import { Button, message, Upload } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { FormItem } from "./FormTest";
type propsType = {
  name: number;
};
export default function ImgaDescrpition({
  name,
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
  return (
    <div>
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
            bottom: 0,
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
            <Button icon={<UploadOutlined />}>Tải lên ảnh minh hoạ</Button>
          </Upload>
        </div>
        <FormItem shouldUpdate noStyle>
          {
            ({getFieldValue})=>{
              return getFieldValue([ROOT_FIELD,name,'image','url']) && (
                <>
                  <Button
                    style={{ position: "absolute", top: 0, right: 0 }}
                    danger
                    type={"dashed"}
                    icon={<CloseOutlined />}
                    onClick={() => {
                      form.setFieldValue([ROOT_FIELD,name,'image'],{
                        url:'',
                        name:''
                      })
                    }}
                  />
                  <img
                    src={form.getFieldValue([ROOT_FIELD,name,'image','url'])}
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
    </div>
  );
}
