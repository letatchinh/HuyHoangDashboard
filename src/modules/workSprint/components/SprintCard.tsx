// /* eslint-disable jsx-a11y/no-access-key */
// import React, { useEffect, useState } from 'react';
// // import { useHistory } from 'react-router-dom';
// import { Button, Form, Input, Tooltip, Typography } from 'antd';
// import { CloseCircleFilled, FormOutlined } from '@ant-design/icons';
// import { unstable_HistoryRouter } from 'react-router-dom';
// // import { WithPermission } from '~/components/Common';
// // import POLICIES from '~/constants/policy';

// interface SprintCardProps {
//   name: string;
//   note: string;
//   type: string;
//   onCreate: (data: { name: string; note: string }) => void;
//   onSave: (data: { name: string; note: string; id: string }) => void;
//   onDelete: (data: { id: string }) => void;
//   id: string;
//   boardId: string;
//   style: React.CSSProperties;
//   userIsAdminforBoard: boolean;
// }

// const SprintCard: React.FC<SprintCardProps> = ({
//   name,
//   note,
//   type,
//   onCreate,
//   onSave,
//   onDelete,
//   id,
//   boardId,
//   style,
//   userIsAdminforBoard,
// }) => {
//   const [note_, setNote] = useState(note);
//   const [name_, setName] = useState(name);
//   const [vis, setVis] = useState(false);

//   function handleSaveNote(data: { name: string; note: string }) {
//     setVis(false);
//     if (type === 'CREATE') {
//       onCreate({ name: data.name, note: data.note });
//     } else if (name_ !== name || note_ !== note) {
//       onSave({ name: name_, note: note_, id });
//     } else {
//       console.log('out');
//     }
//   }

//   useEffect(() => {
//     setName(name);
//     setNote(note);
//   }, [name, note]);

//   const validNote = (value: string) => {
//     setVis(false);
//   };

//   if (type === 'CREATE') return <Create handleSaveNote={handleSaveNote} />;
//   return (
//     <Detail
//       name_={name_}
//       note_={note_}
//       setName={setName}
//       setNote={setNote}
//       setVis={setVis}
//       vis={vis}
//       handleSaveNote={handleSaveNote}
//       note={note}
//       id={id}
//       boardId={boardId}
//       onDelete={onDelete}
//       style={style}
//       userIsAdminforBoard={userIsAdminforBoard}
//     />
//   );
// };

// export default SprintCard;

// interface CreateProps {
//   handleSaveNote: (data: { name: string; note: string }) => void;
// }

// const Create: React.FC<CreateProps> = ({ handleSaveNote }) => {
//   const [form] = Form.useForm();

//   return (
//     <div className="sprint-card-container">
//       <Form
//         form={form}
//         onFinish={(value) => handleSaveNote(value)}
//         layout="horizontal"
//         labelCol={{ span: 24 }}
//       >
//         <Form.Item name={'name'} label={'Danh mục:'}>
//           <Input />
//         </Form.Item>se
//         <Form.Item label="Ghi chú:" name="note">
//           <Input.TextArea
//             autoSize={{ minRows: 2, maxRows: 12 }}
//             style={{ height: 'auto' }}
//             placeholder="Lưu ý!"
//           />
//         </Form.Item>
//         <Button htmlType="submit" type="primary" size="small">
//           Tạo
//         </Button>
//       </Form>
//     </div>
//   );
// };

// interface DetailProps {
//   name_: string;
//   note_: string;
//   setName: React.Dispatch<React.SetStateAction<string>>;
//   setNote: React.Dispatch<React.SetStateAction<string>>;
//   validNote: (value: string) => void;
//   setVis: React.Dispatch<React.SetStateAction<boolean>>;
//   handleSaveNote: (data: { name: string; note: string }) => void;
//   vis: boolean;
//   note: string;
//   id: string;
//   boardId: string;
//   onDelete: (data: { id: string }) => void;
//   style: React.CSSProperties;
//   userIsAdminforBoard: boolean;
// }


