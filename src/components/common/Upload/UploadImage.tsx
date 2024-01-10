
import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Modal, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import {
  DEFAULT_UPLOAD_ACTION,
  MAX_UPLOAD_FILE_SIZE_IN_MB,
} from "~/constants/defaultValue";
import imageCompression from "browser-image-compression";

const BYTES_PER_MB = 1024 * 1024; 

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile, setIsCompressing?: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  const isLtMaxFileSize = file.size / BYTES_PER_MB < MAX_UPLOAD_FILE_SIZE_IN_MB;
    if (!isLtMaxFileSize && isJpgOrPng) {
      message.error(`Image must smaller than ${MAX_UPLOAD_FILE_SIZE_IN_MB}MB!`);
      const options: any = {
        maxSizeMB: MAX_UPLOAD_FILE_SIZE_IN_MB,
        // onProgress: onProgress,
        useWebWorker: true,
      };
      // return new Promise((resolve, reject) => {
      //   (async () => {
      //     try {
      //       setIsCompressing(true);
      //       const compressedFile = await imageCompression(file, options);
      //       resolve(compressedFile);
      //       setIsCompressing(false);
      //     } catch (error) {
      //       reject(error);
      //       setIsCompressing(false);
      //     }
      //   })();
      // });
    };
  return isJpgOrPng && isLt2M;
};

const UploadImage = ({
  setImageUrl,
  imageUrl,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState<boolean>();

  // preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleCancelPreview = () => setPreviewOpen(false);

  // const handlePreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as RcFile, ()=>({}));
  //   }

  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  // };


  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Avatar</div>
    </button>
  );
  const DEFAULT_RESOURCE = `pharma`;

  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={`${DEFAULT_UPLOAD_ACTION}/${DEFAULT_RESOURCE}`}
        beforeUpload={(file) => beforeUpload(file, setIsCompressing)}
        onChange={handleChange}
        // onPreview={handlePreview}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImage;
