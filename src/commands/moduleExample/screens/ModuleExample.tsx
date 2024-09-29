// import { Flex } from "antd";
// import { ColumnsType } from "antd/es/table";
// import React, { useCallback, useState } from "react";
// import ModalAnt from "~/components/common/Antd/ModalAnt";
// import SearchAnt from "~/components/common/Antd/SearchAnt";
// import TableAnt from "~/components/common/Antd/TableAnt";
// import Breadcrumb from "~/components/common/Breadcrumb";
// import BtnAdd from "~/components/common/BtnAdd";
// import ModuleExampleForm from "../components/ModuleExampleForm";
// import {
//     useGetModuleExamples, useModuleExampleQueryParams, useUpdateModuleExampleParams
// } from "../moduleExample.hook";
// type propsType = {};
// export default function ModuleExample(props: propsType): React.JSX.Element {
//   const [id,setId] = useState<String | null>();
//   const [open, setOpen] = useState(false);

//   const [query] = useModuleExampleQueryParams();
//   const [keyword, { setKeyword, onParamChange }] = useUpdateModuleExampleParams(query);
//   const [dataSource, isLoading] = useGetModuleExamples(query);
//   const [isSubmitLoading, onDelete] = useDeleteModuleExample();


// const onOpen = useCallback((i?: string) => {
//     i && setId(i)
//     setOpen(true);
//   }, []);
//   const onCancel = useCallback(() => {
//     setId(null);
//     setOpen(false);
//   }, []);

//   const columns: ColumnsType = [
//     {
//       title: "STT",
//       render: (q, e, i) => ++i,
//       align: "center",
//       width: 80,
//     },
//     {
//       title: "Tên khoá học",
//       dataIndex: "name",
//       key: "name",
//       align: "center",
//     },
// {
//     title: "Thao tác",
//     dataIndex: "_id",
//     key: "_id",
//     align: "center",
//     width: 150,
//     render: (_id) => (
//       <Flex justify={"space-between"}>
//         <Link to={`/moduleExample/${_id}`}>
//           <Button size="small" type="primary">Cập nhật</Button>
//         </Link>
//         <Popconfirm title="Xác nhận xoá" onConfirm={() => onDelete(_id)}>
//           <Button
//             loading={isSubmitLoading}
//             size="small"
//             type="primary"
//             danger
//           >
//             Xoá
//           </Button>
//         </Popconfirm>
//       </Flex>
//     ),
//   },
//   ];
//   return (
//     <div>
//       <Breadcrumb title={"Danh sách khoá học"} />
//       <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
//         <SearchAnt onParamChange={onParamChange} />
//         <BtnAdd onClick={() => onOpen()}>Thêm mới</BtnAdd>
//       </Flex>
//       <TableAnt
//         columns={columns}
//         dataSource={dataSource}
//         stickyTop
//         pagination={{
//           showSizeChanger: true,
//           showTotal: (total) => `Tổng cộng: ${total} `,
//         }}
        
//         loading={isLoading}
//       />
//       <ModalAnt
//         width={1000}
//         title={"Thêm mới Khoá học"}
//         open={open}
//         onCancel={onCancel}
//         destroyOnClose
//         footer={null}
//       >
//         <ModuleExampleForm />
//       </ModalAnt>
//     </div>
//   );
// }
