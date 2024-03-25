import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import { useHookUpload } from './handle';
import { BASE_URL } from '~/constants/defaultValue';

interface Props {
  dataTask?: any;
  handleFinshed?: any;
  fileList_?: any;
  setFileList?: any;
};

function UploadfileTaskItem({dataTask,handleFinshed,fileList_,setFileList}: Props) {

  const {
    onPreview,
    onChange,
    onRemove,
    beforeUpload,
    state:{
        preview,
        current,
        tempFileList,
    },
    handle:{
      setPreview,
      setSrc,
    },
    contentProvider
  } = useHookUpload({dataTask,handleFinshed,fileList_,setFileList});
  return (
    <>
      <Upload
        listType="picture-card"
        multiple
        fileList={fileList_}
        itemRender={(OriginNode, file) => {
          return (
            <div
              key={file.uid}
              style={{ position: 'relative', height: '100%' }}
            >
              {OriginNode}
              <a
                style={{
                  position: 'absolute',
                  bottom: 3,
                  right: 3,
                  padding: '4px 6px',
                  fontSize: 12,
                  zIndex: 999,
                  backgroundColor: '#3E80F3',
                  color: 'white',
                  borderRadius: '50% 0 0 0'
                }}
                href={file.url}
                target="_blank"
                download
              >
                <DownloadOutlined />
              </a>
            </div>
          );
        }}
        onPreview={onPreview}
        onRemove={onRemove}
      />
      <Image.PreviewGroup
        preview={{
          visible: preview,
          scaleStep: 0.5,
          current,
          onVisibleChange: (value) => {
            setPreview(value);
            setSrc(0);
          }
        }}
      >
        {fileList_
          .filter((e: any) => {
            const name = (e?.name ?? '').split('.');
            return ['jpeg', 'jpg', 'png'].includes(name.at(-1));
          })
          .map((e: any) => (
            <Image style={{ display: 'none' }} src={e.url} />
          ))}
      </Image.PreviewGroup>
      <Upload.Dragger
        action={`${BASE_URL}/api/v1/file-more/pharma`}
        onChange={onChange}
        fileList={tempFileList}
        beforeUpload={beforeUpload}
        listType="text"
      >
        <div className="task-upload" style={{ minHeight: 100 }}>
          <p style={{ fontSize: 54 }}>
            <InboxOutlined />
          </p>
          <p> Kéo thả tệp vào đây </p>
        </div>
      </Upload.Dragger>
      {contentProvider}
    </>
  );
}

export default UploadfileTaskItem;
