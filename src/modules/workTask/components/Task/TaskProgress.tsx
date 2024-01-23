import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Image,
  List,
  Modal,
  Row,
  Tag,
  Tooltip,
  Upload,
  notification,
  UploadFile,
} from "antd";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LinkOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { get } from "lodash";
import Text from "antd/lib/typography/Text";
import UploadFileProgress from "./UploadFileProgress";
import SelectUsersAssign from "../SelectUserAssign";

interface Props {
  item?: any;
  progress?: any;
  canAssign?: boolean;
  index?: number;
  onUpdateProgress?: any;
  dataTask?: any;
  onAddProcess?: any;
}

export interface PropsContext {
  setFileList?: any;
  onUpdateProgress?: any;
  index?: any;
  item?: any;
  progress?: any;
  dataTask?: any;
}
const ProgressListItemContext = createContext<PropsContext>({
  setFileList: () => {},
  onUpdateProgress: () => {},
  index: null,
  item: undefined,
  progress: undefined,
  dataTask: undefined,
});
export const useProgressContext = () =>
  useContext<PropsContext>(ProgressListItemContext);

function TaskProgress({
  item,
  progress,
  canAssign,
  index,
  onUpdateProgress,
  dataTask,
  onAddProcess,
}: Props) {
  const [modal, contextProvider] = Modal.useModal();
  const [fileList, setFileList] = useState<UploadFile[] | undefined>();
  const [preview, setPreview] = useState<boolean>(false);
  const [current, setSrc] = useState<number | undefined>(0);
  const [visibilytiUpload, setVisibilityUpload] = useState(0);

  useEffect(() => {
    setFileList(get(item[1], "fileList", []));
  }, [item]);

  const onPreview = (event: any) => {
    const name = (event?.name ?? "").split(".");
    if (["jpeg", "jpg", "png"].includes(name?.at(-1))) {
      setPreview(true);
      const index = fileList
        ?.filter((event: any) => {
          const name = (event?.name ?? "").split(".");
          return ["jpeg", "jpg", "png"].includes(name.at(-1));
        })
        ?.findIndex((val: any) => val.name === event?.name);
      setSrc(index);
      return;
    }
    if (["mp4", "mov"].includes(name.at(-1))) {
      modal.info({
        title: "Nội dung",
        okText: false,
        bodyStyle: { padding: "2px !important", background: "transparent" },
        style: { padding: "2px !important" },
        icon: false,
        okButtonProps: { style: { display: "none" } },
        cancelText: false,
        width: "90%",
        closable: true,
        maskClosable: true,
        content: (
          <div style={{ width: "100%" }}>
            <video autoPlay width="100%" controls>
              <source src={event.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ),
      });
      return;
    }
    notification.warning({
      message: "Loại tệp không hỗ trợ xem trước",
      placement: "bottomRight",
      duration: 0.8,
      key: "notification.warning",
    });
    return;
  };
  return (
    <ProgressListItemContext.Provider
      value={{
        onUpdateProgress,
        progress,
        item,
        index,
        dataTask,
        setFileList,
      }}
    >
      <List.Item
        key={get(item, "_id")}
        actions={[
          <Tooltip title={"Tải tệp lên"} mouseEnterDelay={0.8}>
            <Button
              onClick={() => setVisibilityUpload((e) => !e as any)}
              type={visibilytiUpload ? "primary" : "text"}
            >
              <LinkOutlined />
            </Button>
          </Tooltip>,
          <Button
            onClick={() =>
              onAddProcess(
                get(progress, "_id"),
                get(item, "[1].content") + " (Copy)"
              )
            }
            type="text"
          >
            <CopyOutlined />
          </Button>,
          <Button
            onClick={() => onUpdateProgress(get(progress, "_id"), index)}
            type="text"
          >
            <DeleteOutlined />
          </Button>,
          <Dropdown
            disabled={!canAssign}
            overlay={
              <SelectUsersAssign
                progress={item}
                index={index}
                onUpdateProgress={onUpdateProgress}
                dataSource={get(dataTask, "assignUser", [])}
                progressList={progress}
              />
            }
            trigger={["click"]}
          >
            <Button type="text" icon={<UserAddOutlined />}></Button>
          </Dropdown>,
        ]}
        style={{
          padding: 0,
          borderBottomColor: "transparent",
          alignItems: "flex-start",
        }}
      >
        {get(item, "[1].content") ? (
          <div className="flex-column containerTodoList--list__content">
            <Row style={{ flex: 1 }} gutter={16}>
              <Col>
                <Checkbox
                  onChange={(e) =>
                    onUpdateProgress(get(progress, "_id"), index, [
                      get(item, "[0]"),
                      { ...get(item, "[1]"), check: e.target.checked },
                    ])
                  }
                  checked={get(item, "[1].check")}
                />
              </Col>
              <Col flex={1}>
                <Content
                  progress={progress}
                  item={item}
                  index={index}
                  onUpdateProgress={onUpdateProgress}
                />
              </Col>
              <Col span={24} style={{ height: "max-content" }}>
                <Upload
                  listType="picture-card"
                  multiple
                  fileList={fileList}
                  itemRender={(OriginNode, file, currFileList, v) => {
                    return (
                      <div
                        key={file.url}
                        style={{ position: "relative", height: "100%" }}
                      >
                        {OriginNode}
                        <a
                          style={{
                            position: "absolute",
                            bottom: 3,
                            right: 3,
                            padding: "4px 6px",
                            fontSize: 12,
                            zIndex: 999,
                            backgroundColor: "#3E80F3",
                            color: "white",
                            borderRadius: "50% 0 0 0",
                          }}
                          href={file.url}
                          target="_blank"
                          download={file.name}
                        >
                          <DownloadOutlined />
                        </a>
                      </div>
                    );
                  }}
                  onRemove={(itemRemove: any) => {
                    const _fileList = [fileList];
                    const removeItem = _fileList.findIndex(
                      (val: any) => val.name === itemRemove.name
                    );
                    _fileList.splice(removeItem, 1);
                    const cloneItem = JSON.parse(JSON.stringify([...item]));
                    cloneItem[1].fileList = _fileList;
                    onUpdateProgress(get(progress, "_id"), index, cloneItem);

                    setFileList(_fileList as []);
                  }}
                  onPreview={onPreview}
                />
                {/* {!!visibilytiUpload&& <UploadFileProgress {...{ setFileList }} />} */}

                <Image.PreviewGroup
                  preview={{
                    visible: preview,
                    scaleStep: 0.5,
                    current,
                    onVisibleChange: (value) => {
                      setPreview(value);
                      setSrc(0);
                    },
                  }}
                >
                  {fileList
                    ?.filter((e: any) => {
                      const name = (e?.name ?? "").split(".");
                      return ["jpeg", "jpg", "png"].includes(name.at(-1));
                    })
                    .map((e) => (
                      <Image style={{ display: "none" }} src={e?.url} />
                    ))}
                </Image.PreviewGroup>
              </Col>
            </Row>
            {!!get(item, "[0].assignPopulate", [])?.length ? (
              <Row align="middle" gutter={16}>
                <Col>
                  <Text>Chỉ định: </Text>
                </Col>

                {get(item, "[0].assignPopulate", [])?.map((user: any) => (
                  <Tag color="processing">{get(user, "fullName", "")}</Tag>
                ))}
              </Row>
            ) : null}
          </div>
        ) : null}
        <></>
        {contextProvider}
      </List.Item>
    </ProgressListItemContext.Provider>
  );
}

export default TaskProgress;

interface PropsContent {
  progress?: any;
  item?: any;
  index?: number;
  onUpdateProgress?: any;
}

const Content = ({ item, index, onUpdateProgress, progress }: PropsContent) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
    setText(get(item, "[1].content"));
  }, [isOpen, item]);
  const onCancel = useCallback(() => {
    setIsOpen(false);
    setText("");
  }, []);
  const onUpdate = () => {
    onUpdateProgress(get(progress, "_id"), index, [
      get(item, "[0]"),
      { ...get(item, "[1]"), content: text },
    ]);
    onCancel();
  };

  return isOpen ? (
    <div>
      <TextArea
        style={{ width: "100%" }}
        rows={4}
        autoFocus
        placeholder="Nhập nội dung công việc"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Row style={{ marginTop: 20 }}>
        <Button onClick={onUpdate} type="primary">
          Lưu
        </Button>
        <Button onClick={onCancel} type="text">
          Huỷ
        </Button>
      </Row>
    </div>
  ) : (
    <Text style={{ cursor: "pointer" }} onClick={toggle}>
      {get(item, "[1].content")}
    </Text>
  );
};
