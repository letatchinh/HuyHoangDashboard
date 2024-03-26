import { Form } from "antd";
import React from "react";
import RenderLoading from "~/components/common/RenderLoading";
import UploadImage from "~/components/common/Upload/UploadImage";
import { FieldTypeFormProduct } from "../product.modal";
type propsType = {
  isLoading: boolean;
  form: any;
};
export default function ImagesProduct({
  isLoading,
  form,
}: propsType): React.JSX.Element {
  return (
    <Form.Item shouldUpdate noStyle>
      {() => (
        <Form.Item<FieldTypeFormProduct> label="Hình ảnh" name="images" labelCol={{span : 3}} wrapperCol={{span : 21}}>
          {RenderLoading(
            isLoading,
            <UploadImage
              className="imageProduct"
              title="Thêm ảnh"
              allowList={true}
              imgUrl={form.getFieldValue("images")}
              onChange={(url: any) => form.setFieldsValue({ images: url })}
              setIsLoading={() => {}}
              children={null}
            />
          )}
        </Form.Item>
      )}
    </Form.Item>
  );
}
