import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, GetProp, UploadProps } from "antd";
import { message, Upload } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "~/constants/defaultValue";
import FileCustom from "../File/FileCustom";
import VideoCustom from "../VideoCustom/index";
import ImageCustom from "./ImageCustom";
const DEFAULT_UPLOAD_ACTION = `${BASE_URL}api/upload`;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
interface PropsType extends UploadProps {
  resource: ResourceUpload;
  typeComponent: "video" | "image" | "document";
  customPath?: string;
  onHandleChange: (url: string) => void;
  value?: string;
}
const acceptList = {
  document:
    ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf",
  image: ".png,.webp",
  video: ".mp4,.mov",
};
const name = {
  document: "file",
  image: "ảnh",
  video: "video",
};
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isLt2M;
};

const UploadCustom = ({
  resource,
  typeComponent,
  onHandleChange,
  value,
  customPath,
  ...props
}: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>();

  const handleSetData = (data: string) => {
    onHandleChange(data);
    setDataSource(data);
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      handleSetData(info.file.response?.path);
      setLoading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload {typeComponent}</div>
    </button>
  );

  useEffect(() => {
    if (!dataSource) {
      setDataSource(value);
    }
  }, [value, dataSource]);
  return (
    <>
      <Upload
        name="image"
        listType="picture-card"
        accept={acceptList[typeComponent]}
        showUploadList={false}
        action={`${DEFAULT_UPLOAD_ACTION}?folder=${resource}${
          customPath ? customPath : ""
        }/${typeComponent}`}
        // beforeUpload={beforeUpload}
        {...props}
        onChange={handleChange}
      >
        {typeComponent === "image" &&
          (dataSource ? (
            <ImageCustom preview={false} src={dataSource} />
          ) : (
            uploadButton
          ))}
        {typeComponent === "video" &&
          (dataSource ? <VideoCustom src={dataSource} /> : uploadButton)}
        {typeComponent === "document" && uploadButton}
        <Flex justify={"end"}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleSetData("")
          }}
          icon={<DeleteOutlined />}
          type="primary"
          ghost
          danger
          style={{position : 'absolute',right : 0,top : 0,bottom : 0,width : 100,borderRadius : 0}}
        >
          Gỡ {name[typeComponent]}
        </Button>
      </Flex>
      </Upload>
      
      {typeComponent === "document" && dataSource && (
        <FileCustom src={dataSource} />
      )}
    </>
  );
};

export default UploadCustom;
