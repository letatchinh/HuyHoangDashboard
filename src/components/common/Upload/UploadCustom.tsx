import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { BASE_URL } from '~/constants/defaultValue';
import FileCustom from '../File/FileCustom';
import VideoCustom from '../VideoCustom/index';
import ImageCustom from './ImageCustom';
const DEFAULT_UPLOAD_ACTION = `${BASE_URL}api/upload`;
const DEFAULT_RESOURCE = "unknown";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface PropsType extends UploadProps {
    resource : 'course' | 'unknown' |'scheduleItem',
    typeComponent : 'video' | 'image' | 'document',
    customPath? : string,
    onHandleChange : (url : string) => void,
    value? : string
}
const acceptList = {
  document : '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  image : '.png,.webp',
  video : '.mp4,.mov'
}
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!');
//   }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  };
  return isLt2M;
};

const UploadCustom = ({resource = DEFAULT_RESOURCE,typeComponent,onHandleChange,value,customPath,...props}:PropsType) => {
  
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>();
  
  const handleChange: UploadProps['onChange'] = (info) => {
      
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
        setDataSource(info.file.response?.path);
        onHandleChange(info.file.response?.path)
        setLoading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload {typeComponent}</div>
    </button>
  );

  useEffect(() => {
    if(!dataSource){
      setDataSource(value)
    }
  },[value,dataSource])
  return (
      <>
      <Upload
        name="image"
        listType="picture-card"
        accept={acceptList[typeComponent]}
        showUploadList={false}
        action = {`${DEFAULT_UPLOAD_ACTION}?folder=${resource}/${typeComponent}${customPath && customPath}`}
        // beforeUpload={beforeUpload}
        {...props}
        onChange={handleChange}
      >
        {typeComponent === 'image' && (dataSource ? <ImageCustom preview={false} src={dataSource} /> : uploadButton)}
        {typeComponent === 'video' && (dataSource ? <VideoCustom src={dataSource} /> : uploadButton)}
        {typeComponent === 'document' && uploadButton}
      </Upload>
      {typeComponent === 'document' && dataSource && <FileCustom fileName={dataSource} src={dataSource} />}
      </>
  );
};

export default UploadCustom;