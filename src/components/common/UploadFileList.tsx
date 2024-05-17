import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Form, message, Upload } from 'antd';
import { BASE_URL } from '~/constants/defaultValue';
import useNotificationStore from '~/store/NotificationContext';

interface props{
  contract?: any;
  setGetFiles?: any;
  getFiles?: any;
};
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 1; //1 Mb
const BYTES_PER_MB = 1024 * 1024;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: `${BASE_URL}/api/v1/file-more/pharma`,
};

const UploadListFile = ({setGetFiles,getFiles,contract}: props) => {
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
  const onChange = ({ file, fileList }: any) => {
    const isLtMaxFileSize = file.size / BYTES_PER_MB < MAX_UPLOAD_FILE_SIZE_IN_MB;
    if (!isLtMaxFileSize) {
      onNotify?.error(`File đính kèm phải nhỏ hơn 1Mb`);
      return;
    };
      setFileListUrl([...fileList]); // set file list to first state
    if (file.status !== 'uploading') {
        setFileListUrl([...fileList]);
      };
    if (file.status === 'done') {
        setFileListUrl([...fileList]);
      } else if (file.status === 'error') {
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