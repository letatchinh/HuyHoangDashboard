import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile, UploadProps, notification } from "antd";
import { BASE_URL } from "~/constants/defaultValue";
import { useProgressContext } from "~/modules/workTask/components/Task/TaskProgress";
import { get } from "lodash";

interface UploadImageProps {}
const propsUpload = {
  name: "file",
  multiple: true,
  action: `${BASE_URL}/api/v1/file-more/pharma`,
  beforeUpload: (file: any) => {
    return true;
  },
};
export default function UploadListFile() {
  const [fileList, setFileList] = useState<UploadFile[]>([])

    const handleChange: UploadProps['onChange'] = (info) => {
      let newFileList = [...info.fileList];
  
      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new
      // newFileList = newFileList.slice(-2);
  
      newFileList = newFileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      setFileList(newFileList);
    };
 

  return (
    <Upload
      {...propsUpload}
      fileList={fileList}
      onChange={handleChange}
      listType="text"
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
}
