import {
  CheckSquareOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Input,
  List,
  Popconfirm,
  Progress,
  Row,
  Typography,
} from "antd";
import Text from "antd/lib/typography/Text";
import { get } from "lodash";
import { useCallback, useState } from "react";
import TaskProgress from "./Task/TaskProgress";
import AddTodo from "./AddTodo";
import useTaskItemStore from "~/store/TaskItemContext";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import { useResetAction } from "../workTask.hook";

interface PropsFooter {
  onAddProcess?: any;
  id?: any;
  canAssign?: boolean;
}

interface PropsHeader {
  progress?: any;
  onUpdateProgressList?: any;
  onRemoveProgressList?: any;
  onUpdateProgress?: any;
  onCopyProcess?: any;
  canAssign?: any;
}

interface PropsTodoList {
  dataTask?: any;
  updateProgressTask?: any;
}
const Footer_ = ({ onAddProcess, id, canAssign }: PropsFooter) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const onCancel = useCallback(() => {
    setIsOpen(false);
    setText("");
  }, []);
  const onAdd = () => {
    onAddProcess(id, text);
    onCancel();
  };
  return !isOpen ? (
    <Button onClick={toggle} type="dashed">
      Thêm một mục
    </Button>
  ) : (
    <div className="flex-column-center">
      <Input
        onPressEnter={onAdd}
        autoFocus
        placeholder="Nhập nội dung công việc"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Row>
        <Button onClick={onAdd} type="primary">
          Lưu
        </Button>
        <Button onClick={onCancel} type="text">
          Huỷ
        </Button>
      </Row>
    </div>
  );
};

const Header_ = ({
  progress,
  onRemoveProgressList,
  onCopyProcess,
  onUpdateProgressList,
  canAssign,
}: PropsHeader) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
    setText(get(progress, "name"));
  }, [isOpen, progress]);
  const onCancel = useCallback(() => {
    setIsOpen(false);
    setText("");
  }, []);
  const onUpdate = () => {
    onUpdateProgressList(get(progress, "_id"), {
      ...progress,
      name: text,
    });
    onCancel();
  };
  return (
    <div>
      <Row justify="space-between">
        <Col span={18}>
          <Row gutter={16}>
            <Col>
              <CheckSquareOutlined />
            </Col>
            {isOpen ? (
              <Col flex={1}>
                <Input
                  onPressEnter={onUpdate}
                  style={{ width: "100%" }}
                  autoFocus
                  placeholder="Nhập tên công việc"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Row style={{ marginTop: 20 }}>
                  <Button
                    disabled={!canAssign}
                    onClick={onUpdate}
                    type="primary"
                  >
                    Lưu
                  </Button>
                  <Button onClick={onCancel} type="text">
                    Huỷ
                  </Button>
                </Row>
              </Col>
            ) : (
              <Text style={{ cursor: "pointer" }} onClick={toggle} strong>
                {get(progress, "name", "")}
              </Text>
            )}
          </Row>
        </Col>
        <Row gutter={16}>
          <Col>
            <Button onClick={onCopyProcess} size="small">
              Sao chép
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="Bạn muốn xoá công việc này?"
              onConfirm={() => onRemoveProgressList(get(progress, "_id", ""))}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button size="small" danger>
                Xoá
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Row>
      <Progress percent={get(progress, "progressValue", 0)} />
    </div>
  );
};

export default function TodoList({
  dataTask,
  updateProgressTask,
}: PropsTodoList) {
  const [activeAddTodo, setActiveAddTodo] = useState(false);
  const {
    assign: { canAssign, users },

  } = useTaskItemStore();
  const onAddProcess = (progressListId:any, newProcessContent:any) => {
    const processUpdate = get(dataTask, 'progressList', [])?.find((item:any) => get(item, '_id') === progressListId);
    const newProgress = [
      {
        assign: "",
      },
      {
        check: false,
        content: newProcessContent
      }
    ];
    const processUpdateSubmit = { ...processUpdate, progress: [...get(processUpdate, 'progress', []), newProgress] };
    updateProgressTask({
      id: get(dataTask, '_id'),
      progressList: get(dataTask, 'progressList', [])?.map((item:any) => get(item, '_id') === get(processUpdateSubmit, '_id') ? processUpdateSubmit : item)
    });
  };
  const onCopyProcess = (progressListId: any) => {
    const processCopy = get(dataTask, "progressList", [])?.find(
      (item: any) => get(item, "_id") === progressListId
    );
    const progressReset = get(processCopy, "progress", [])?.map((item: any) => [
      { assign: "" },
      { ...get(item, "[1]"), check: false },
    ]);
    const processUpdateSubmit = [
      ...get(dataTask, "progressList", []),
      { name: get(processCopy, "name") + " (copy)", progress: progressReset },
    ];
    updateProgressTask({
      id: get(dataTask, "_id"),
      progressList: processUpdateSubmit,
    });
  };

  const onRemoveProgressList = (progressListId: any) => {
    updateProgressTask({
      id: get(dataTask, "_id"),
      progressList: get(dataTask, "progressList", [])?.filter(
        (item: any) => get(item, "_id") !== progressListId
      ),
    });
  };

  const onUpdateProgress = (progressListId: any, index: any, newData: any) => {
    // Find Progress List To Update
    const progressListUpdate = get(dataTask, "progressList", [])?.find(
      (item: any) => get(item, "_id") === progressListId
    );

    // Clone progress It
    const cloneProgress = [...get(progressListUpdate, "progress", [])];

    // Replace new progress with Index of Progress
    if (!!newData) {
      // Update
      cloneProgress.splice(index, 1, newData);
    } else {
      // Remove
      cloneProgress.splice(index, 1);
    }

    // Create new ProgressList Update
    const newProgressListUpdate = {
      ...progressListUpdate,
      progress: cloneProgress,
    };

    // Create SubmitListProgress
    const processListSubmit = get(dataTask, "progressList", [])?.map(
      (item: any) =>
        get(item, "_id") === progressListId ? newProgressListUpdate : item
    );

    // Handle Update
    updateProgressTask({
      id: get(dataTask, "_id"),
      progressList: processListSubmit,
    });
  };

  const onUpdateProgressList = (progressListId: any, newData: any) => {
    // Create SubmitListProgress
    const processListSubmit = get(dataTask, "progressList", [])?.map(
      (item: any) => (get(item, "_id") === progressListId ? newData : item)
    );
    // Handle Update
    updateProgressTask({
      id: get(dataTask, "_id"),
      progressList: processListSubmit,
    });
  };
  useResetAction();
  if (!get(dataTask, "progressListShow", [])) return null;
  return (
    <BaseBorderBox
      title={
        <span>
          <MenuOutlined /> <Text strong>Danh sách công việc</Text>
        </span>
      }
    >
      <div className="task-detail-content-left-button-tab add-job my-2">
        <Dropdown
          onOpenChange={setActiveAddTodo}
          open={activeAddTodo}
          dropdownRender={() => (
            <AddTodo
              updateProgressTask={updateProgressTask}
              dataTask={dataTask}
              setActiveAddTodo={setActiveAddTodo}
            />
          )}
          getPopupContainer={() =>
            document.querySelector(
              ".task-detail-content-left-button-tab.add-job"
            ) as HTMLElement
          }
          trigger={["click"]}
        >
          <Button type="primary" icon={<PlusCircleOutlined />}>
            Thêm công việc
          </Button>
        </Dropdown>
      </div>
      &nbsp;
      <div className="containerTodoList">
        {get(dataTask, "progressListShow", [])?.map((progress: any) => (
          <List
            className="containerTodoList--list"
            dataSource={get(progress, "progress", [])}
            header={
              <Header_
                canAssign={canAssign}
                onCopyProcess={() => onCopyProcess(get(progress, "_id"))}
                progress={progress}
                onUpdateProgressList={onUpdateProgressList}
                onRemoveProgressList={onRemoveProgressList}
              />
            }
            footer={
              <Footer_
                canAssign={canAssign}
                onAddProcess={onAddProcess}
                id={get(progress, "_id")}
              />
            }
            locale={{
              emptyText: <div></div>,
            }}
            renderItem={(item, index) => {
              return (
                <TaskProgress
                  {...{
                    item,
                    progress,
                    canAssign,
                    index,
                    onUpdateProgress,
                    dataTask,
                    onAddProcess,
                  }}
                />
              );
            }}
          />
        ))}
        {!get(dataTask, "progressListShow", [])?.length && (
          <Typography.Title level={5} type="secondary">
            Danh sách công việc trống
          </Typography.Title>
        )}
      </div>
    </BaseBorderBox>
  );
}
