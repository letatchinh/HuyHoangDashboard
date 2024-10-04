import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Progress, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { UploadFile } from 'antd/lib/index';
import imageCompression from 'browser-image-compression';
import { get } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  DEFAULT_UPLOAD_ACTION,
  MAX_UPLOAD_FILE_SIZE_IN_MB
} from '~/constants/defaultValue';
import './index.scss'
const BYTES_PER_MB = 1024 * 1024;

const allowedImageExtensions: string[] = ['image/jpeg', 'image/png','image/gif','image/webp'];

interface UploadImageProps {
  index?: number;
  onChange?: any;
  imgUrl: any;
  title?: string;
  action?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  isShowImg?: boolean
  setIsLoading?: any;
  isLoading?: boolean;
  resource : ResourceUpload,
  allowList?:boolean;
  customPath? : string;
};

const MAX_IMAGES = 5;
const UploadImage: React.FC<UploadImageProps> = ({
  index,
  onChange,
  imgUrl,
  title,
  resource,
  customPath,
  action = `${DEFAULT_UPLOAD_ACTION}?folder=${resource}/image/${customPath && customPath}`,
  // children,
  disabled = false,
  className,
  isShowImg = true,
  setIsLoading,
  isLoading,
  allowList = false
}) => {
  const [loading,setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressPercent, setCompressPercent] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState('');

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

  const handleChange : UploadProps['onChange'] = useCallback(
    ({file,fileList} : UploadChangeParam) => {
      setLoading(true);
      if(file?.status === 'error'){
         message.error('Lỗi khi tải ảnh lên, Vui lòng gửi ảnh dung lượng nhỏ hơn 1 MB hoặc thử lại!');
      }
      if(allowList){// Mode List
        const newFileList = fileList?.map((value : UploadFile) => ({
          url : get(value,'response.url',''),
          ...value,
        }))
        onChange(newFileList);
        
      }else{// Mode Single
        if (file?.status === 'uploading') {
          setIsLoading && setIsLoading(true);
          return;
        }
        if (file?.status === 'done') {
          const imageUrl: string | undefined = file?.response?.url;
          setIsLoading && setIsLoading(false);
          if (imageUrl) {
            onChange(imageUrl);
          };
        }
      }
      setLoading(false);
    },
    [onChange]
  );

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));

  }
  const handleCancel = () => setPreviewImage('');


  const uploadButton = (
    <div>
      {isCompressing || loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {isCompressing ? (
          <>
            <p>Đang nén hình ảnh</p>
            <Progress percent={compressPercent} status="active" />
          </>
        ) : loading ? (
          'Đang tải lên'
        ) : (
          title || 'Logo'
        )}
      </div>
    </div>
  );
  
  return (
<>
    <Upload
      name="file"
      listType="picture-card"
      className= { className ?? "avatar-uploader"}
      action={action}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      disabled={disabled}
      multiple={allowList}
      {...allowList && {fileList : imgUrl}}
      maxCount={MAX_IMAGES}
      onPreview={handlePreview}
      showUploadList={allowList}
      
    >
      {allowList ? 
      (imgUrl?.length >= MAX_IMAGES ? null : uploadButton) :  
      (isShowImg &&(imgUrl && !isCompressing && !isLoading) ? (
        <img
          src={imgUrl}
          alt="avatar"
          style={{ maxWidth: '100%', maxHeight: '100%',objectFit : 'contain' }}
        />
      ) : (
        uploadButton
        ))}
    </Upload>
    <Modal closable={false} open={!!previewImage} footer={null} onCancel={handleCancel}>
    <img alt="Ảnh xem trước" style={{ width: '100%' }} loading="lazy" src={previewImage} />
  </Modal>
</>
  );
};

export default UploadImage;
