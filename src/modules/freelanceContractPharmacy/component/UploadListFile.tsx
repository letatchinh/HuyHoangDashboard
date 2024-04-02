import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, notification } from "antd";
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
  const [tempFileList, setFileListTemp] = useState([]);
  const { setFileList, onUpdateProgress, index, item, progress } =
    useProgressContext();

  const onChange = ({ file, fileList }: any) => {
    setFileListTemp(fileList);
    if (file?.status === "done") {
      const progressId = get(progress, "_id");
      const data = JSON.parse(JSON.stringify([...item]));
      const convertFile = (fileItem: any) => {
        return {
          name: fileItem.name,
          url: fileItem.response?.url ?? "",
        };
      };
      if (!data[1]?.fileList) Object.assign(data[1], { fileList: [] });

      data[1].fileList.push(convertFile(file));
      onUpdateProgress(progressId, index, data);
      setFileListTemp(fileList);
      setFileList((e: any) => [...e, ...fileList?.map(convertFile)]);
      setTimeout(() => {
        setFileListTemp([]);
      }, 1000);

      notification.success({ message: `${file.name} tải lên thành công.` });
    } else if (file?.status === "error") {
      notification.error({ message: `${file.name} tải lên thất bại.` });
    }
  };
 console.log(item, "item");
 

  return (
    <Upload.Dragger
      {...{ ...propsUpload, onChange, fileList: tempFileList }}
      listType="text"
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload.Dragger>
  );
}
