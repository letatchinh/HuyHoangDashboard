// import React, { useState } from "react";
// import { UploadOutlined } from "@ant-design/icons";
// import { Button, Upload, UploadFile, UploadProps, notification } from "antd";
// import { BASE_URL } from "~/constants/defaultValue";
// import { useProgressContext } from "~/modules/workTask/components/Task/TaskProgress";
// import { get } from "lodash";
// import useNotificationStore from "~/store/NotificationContext";

// interface UploadImageProps {}
// const propsUpload = {
//   name: "file",
//   multiple: true,
//   action: `${BASE_URL}/api/v1/file-more/pharma`,
//   beforeUpload: (file: any) => {
//     console.log(file,'beforeUpload')
//     return true;
//   },
// };
// export default function UploadListFile() {
//   const [fileList, setFileList] = useState([]);
//   const { onNotify } = useNotificationStore();

//   console.log(fileList,'fileList')
//   const handleChange: UploadProps['onChange'] = (info) => {
//     console.log(info,'info')
//       try {
//           let newFileList : any = [...info.fileList];
      
//           // 1. Limit the number of uploaded files
//           // Only to show two recent uploaded files, and old ones will be replaced by the new
//           // newFileList = newFileList.slice(-2);
      
//         newFileList = newFileList.map((file: any) => {
//             console.log(file,'file')
//             if (file?.response) {
//               file.url = file?.response?.url;
//             };
//             return file?.url && file?.url;
//           });
//         console.log(newFileList,'newFileList')
//           setFileList(newFileList);
//       } catch (error) {
//         onNotify?.error('Có lỗi xảy ra trong quá trình gửi file')
//       }
//     };
 

//   return (
//     <Upload
//       {...propsUpload}
//       // fileList={fileList}
//       onChange={handleChange}
//       listType="text"
//     >
//       <Button icon={<UploadOutlined />}>Upload</Button>
//     </Upload>
//   );
// }

import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Form, message, Upload } from 'antd';
import { BASE_URL } from '~/constants/defaultValue';
import useNotificationStore from '~/store/NotificationContext';

interface props{
  contract?: any
};
const props: UploadProps = {
  name: "file",
  multiple: true,
  action: `${BASE_URL}/api/v1/file-more/pharma`,
};

const UploadListFile = ({contract}: props) => {
  const [fileListUrl, setFileListUrl] = useState<any[]>([]);
  const { onNotify } = useNotificationStore();
  useEffect(() => {
    if (contract?.files?.length > 0) {
      const data = contract?.files?.map((item: any) => ({
        response: {
          url: item?.url
        },
        name: item?.name,
        uid: item?.url,
        status: "done",
        key: item?.url
      }));
      setFileListUrl([...data]);
    };
  }, [contract]);
console.log(fileListUrl,'fileListUrl')
  const onChange = ({ file, fileList }: any) => {
      setFileListUrl([...fileList]); // set file list to first state
    if (file.status !== 'uploading') {
        setFileListUrl([...fileList]);
      };
    if (file.status === 'done') {
        setFileListUrl([...fileList]);
      } else if (file.status === 'error') {
        console.log(file.status,'adasda');
      };
  };
  return (
    <Form.Item
      label="File đính kèm"
      name="files"
      wrapperCol={{ sm: 24, md: 24, lg: 21 }}
    >
      <Upload {...props} onChange = {onChange} fileList = {fileListUrl}  >
        <Button icon={<UploadOutlined />}>Đính kèm</Button>
        </Upload>
      </Form.Item>
      )
};
export default UploadListFile;