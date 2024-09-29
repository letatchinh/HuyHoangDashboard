// import { Form, Input } from "antd";
// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import BtnSubmit from "~/components/common/BtnSubmit";
// import Loading from "~/components/common/Loading/index";
// import { requireRules } from "~/constants/defaultValue";
// import { useCreateModuleExample, useGetModuleExample, useUpdateModuleExample } from "../moduleExample.hook";
// export default function ModuleExampleForm(): React.JSX.Element {
//   const { id } = useParams();
//   const [form] = Form.useForm();
//   const [isSubmitLoading,onCreate] = useCreateModuleExample(() => form.resetFields());
//   const [,onUpdate] = useUpdateModuleExample();
//   const [data,loading] = useGetModuleExample(id);
//   const onFinish = (values: any) => {
//     if(id){
//       onUpdate({
//         id,
//         ...values
//       });
//     }else{
//       onCreate({
//         ...values
//       })
//     }
//   };
//   useEffect(() => {
//     if(data && id){
//       form.setFieldsValue({...data});
//     }else{
//       form.resetFields();
//     }
//   },[data,id])
//   return (
//     <Form
//       labelCol={{ span: 4 }}
//       labelAlign="left"
//       form={form}
//       onFinish={onFinish}
//     >
//       {loading && <Loading />}
//       <h4>{id ? "Cập nhật" : "Tạo mới" + " nhóm khoá học"}</h4>
//       <Form.Item name={"name"} label="Tên" rules={requireRules}>
//         <Input />
//       </Form.Item>
//       <BtnSubmit id={id} loading={isSubmitLoading}/>
//     </Form>
//   );
// }
