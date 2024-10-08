import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Button, Flex, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "~/constants/defaultValue";
import FileCustom from "../File/FileCustom";
import VideoCustom from "../VideoCustom/index";
import ImageCustom from "./ImageCustom";
const DEFAULT_UPLOAD_ACTION = `${BASE_URL}api/upload`;
interface PropsType extends UploadProps {
  resource: ResourceUpload;
  typeComponent: "video" | "image" | "document";
  customPath?: string;
  onHandleChange: (url: string) => void;
  value?: string;
  placeholder?: string;
}
const acceptList = {
  document:
    ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf",
  image: ".png,.webp,.jpg",
  video: ".mp4,.mov",
};


const UploadCustom = ({
  resource,
  typeComponent,
  onHandleChange,
  value,
  customPath,
  className,
  placeholder,
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
      {placeholder ? (
        <div style={{ marginTop: 8 }}>{placeholder}</div>
      ) : (
        <div style={{ marginTop: 8 }}>Upload {typeComponent}</div>
      )}
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
        {...props}
        className={className ? `uploadCustom ${className}` : "uploadCustom"}
        onChange={handleChange}
      >
        {/* Preview */}
        {typeComponent === "image" &&
          (dataSource ? (
            <ImageCustom preview={false} src={dataSource} />
          ) : (
            uploadButton
          ))}
        {typeComponent === "video" && (dataSource ? <VideoCustom src={dataSource} /> : uploadButton)}
        {typeComponent === "document" && uploadButton}

        {/* X Close */}
        {value && (
          <Flex justify={"end"}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSetData("");
              }}
              icon={<DeleteOutlined />}
              type="primary"
              danger
              className="uploadCustom--btnRemove"
            />
          </Flex>
        )}
      </Upload>

      {/* Preview File */}
      {typeComponent === "document" && dataSource && (
        <FileCustom src={dataSource} />
      )}
    </>
  );
};

export default UploadCustom;
