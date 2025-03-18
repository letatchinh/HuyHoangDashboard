import { Button, Flex, Input, message, Upload } from "antd";
import React, { useState } from "react";
import { FormItem } from "./FormTest";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { defaultTo, head } from "lodash";
type propsType = {
  children?:
    | (() => React.JSX.Element | React.ReactNode | string)
    | React.ReactNode;
  name: number;
};
export default function AudioDescription(props: propsType): React.JSX.Element {

  return (
    <>
      {typeof props.children === "function" ? props.children() : props.children}
      <strong>Audio minh hoạ:</strong>
      <FormItem name={[props.name, "audio"]}>
        <RenderUpload />
      </FormItem>
    </>
  );
}

type PropsUpload = {
  value?: any;
  onChange?: () => void;
};

function RenderUpload(props: PropsUpload) {
  const [fileList, setFileList] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const beforeUpload = () => false;
  const handleChange = ({ fileList: newFileList }) => {
    const { originFileObj } = defaultTo(head(newFileList),{originFileObj:null}) as any
    if (originFileObj) {
        const audioURL = URL.createObjectURL(originFileObj);
        setAudioPreview(audioURL);
      }
      else {
        setAudioPreview(null);
      }

    setFileList(newFileList);
  };

  return (
    <Flex align="center" gap={10}>
      <Upload
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
        itemRender={()=><></>}
        showUploadList={true}
        accept="audio/*"
      >
        <Button type="dashed" style={{width:190}} icon={<UploadOutlined />}>Tải lên file audio</Button>
      </Upload>
      {audioPreview && (
        <>
            <audio controls style={{ width:'100%',maxWidth:700,height:32}} controlsList="nodownload">
                <source src={audioPreview} type="audio/mpeg" />
            </audio>
            <Button onClick={()=>{
                setFileList([])
                setAudioPreview(null)
            }} danger type="dashed" icon={<DeleteOutlined/>}></Button>
        </>
      )}
     
    </Flex>
  );
}
