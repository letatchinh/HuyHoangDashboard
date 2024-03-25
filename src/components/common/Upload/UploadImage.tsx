import React, { useState, useCallback } from 'react';
import { Progress, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import {
  DEFAULT_UPLOAD_ACTION,
  MAX_UPLOAD_FILE_SIZE_IN_MB
} from '~/constants/defaultValue';

const BYTES_PER_MB = 1024 * 1024;

const allowedImageExtensions: string[] = ['image/jpeg', 'image/png'];

interface UploadImageProps {
  index?: number;
  onChange?: any;
  imgUrl: string | undefined;
  title?: string;
  action?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  isShowImg?: boolean
  setIsLoading?: any;
  isLoading?: boolean;
};

const DEFAULT_RESOURCE: string = 'pharma';

const UploadImage: React.FC<UploadImageProps> = ({
  index,
  onChange,
  imgUrl,
  title,
  action = `${DEFAULT_UPLOAD_ACTION}/${DEFAULT_RESOURCE}`,
  children,
  disabled = false,
  className,
  isShowImg = true,
  setIsLoading,
  isLoading
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressPercent, setCompressPercent] = useState<number>(0);

  const beforeUpload = async (file: File) => {
    const isImage: boolean = allowedImageExtensions.includes(file.type);
    
    if (!isImage) {
      message.error(`
        You can only upload ${allowedImageExtensions
          .map((item) => item.split('/')[1].toUpperCase())
          .join('/')} file!
      `);
      return false;
    }

    const isLtMaxFileSize: boolean = file.size / BYTES_PER_MB < MAX_UPLOAD_FILE_SIZE_IN_MB;

    if (!isLtMaxFileSize && isImage) {
      const options = {
        maxSizeMB: MAX_UPLOAD_FILE_SIZE_IN_MB,
        onProgress: (progress: number) => setCompressPercent(progress),
        useWebWorker: true,
      };

      try {
        setIsCompressing(true);
        const compressedFile: File = await imageCompression(file, options);
        onChange(URL.createObjectURL(compressedFile));
        setIsCompressing(false);
      } catch (error) {
        message.error('Error compressing image');
        setIsCompressing(false);
        return false;
      }
    }

    return isImage && isLtMaxFileSize;
  };

  const handleChange = useCallback(
    (info: any) => {
      if (info?.file?.status === 'uploading') {
        setIsLoading(true);
        return;
      }
      if (info?.file?.status === 'done') {
        const imageUrl: string | undefined = info.file?.response?.url;
        setIsLoading(false);
        if (imageUrl) {
          onChange(imageUrl);
        };
      }
    },
    [onChange]
  );

  const uploadButton = (
    <div>
      {isCompressing || isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {isCompressing ? (
          <>
            <p>Đang nén hình ảnh</p>
            <Progress percent={compressPercent} status="active" />
          </>
        ) : isLoading ? (
          'Đang tải lên'
        ) : (
          title || 'Logo'
        )}
      </div>
    </div>
  );
  return (
    <Upload
      name="file"
      listType="picture-card"
      className= { className ?? "avatar-uploader"}
      showUploadList={false}
      action={action}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      disabled={disabled}
    >
      { isShowImg &&(imgUrl && !isCompressing && !isLoading ? (
        <img
          src={imgUrl}
          alt="avatar"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        uploadButton
        ))}
      {children}
    </Upload>
  );
};

export default UploadImage;
