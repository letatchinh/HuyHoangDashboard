import { Col, Input, Row, Skeleton } from "antd";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CloseOutlined, ExportOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { get } from "lodash";
import { useFormTaskContext } from "~/modules/workList/screens/WorkList";
import { TaskItemProvider } from "~/store/TaskItemContext";
import TaskItem from "../../screens/WorkTask";
import apis from "../../workTask.api";
import { useGetTaskById, useResetAction, useResetComment } from "../../workTask.hook";
import SelectStatusTask from "../SelectStatusTask";
interface Props {
    idTask?: any;
    taskData?: any;
    setVisibleInfo?: any;
};
export default function TaskTabDetail({ idTask, }: Props) {
    const {
        setVisibleInfo,
        boardData: boardById,
    } = useFormTaskContext();
    const [dataTask, isLoading] = useGetTaskById(idTask);
    const [, handleResetComment] = useResetComment();
    const [inputValue, setInputValue] = useState('');
    const [fileList_, setFileList] = useState([]);
    const [selected, setSelected] = useState(get(dataTask?.statusId, "_id"));
    useEffect(() => {
        if (dataTask?.fileList) {
            setInputValue(get(dataTask, "name", ""));
            setFileList(dataTask?.fileList ?? []);
        }
    }, [dataTask]);
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = async (ev: any) => {
        if (!ev.target.value) {
            setInputValue(get(dataTask, "name", ""));
            
        };
        if (ev.target.value === get(dataTask, "name", "")) {
            return ;
        };
        return apis.update({ name: ev.target.value, _id: idTask });
    };
    useEffect(() => {
        return () => {
            handleResetComment([]);
        };
    }, [dataTask?._id]);

    useEffect(() => {
        const statusItem = boardById?.listStatusConfig.find(
            (item: any) => item?._id === dataTask?.statusId?._id
        );

        if (statusItem) {
            setSelected(statusItem._id);
        } else if (typeof dataTask?.statusId === "object") {
            setSelected(get(dataTask?.statusId, "value", "Không xác định"));
        } else {
            setSelected("Không xác định");
        }
    }, [boardById?.listStatusConfig, dataTask?.statusId]);
    const handleChange = async (value: string) => {
        setSelected(value);
        await apis.update({ statusId: value, _id: idTask });
    };
    useEffect(() => {
       return console.log('unmount') 
    },[])
    useResetAction();
    return (
        <TaskItemProvider
            dataTask={dataTask}

        >
            <Row wrap={false} className="view-port-info-header" >
                <Col style={{ marginRight: 8 }}>
                    <Suspense fallback={<div>Trạng thái...</div>}>
                        <SelectStatusTask handleChangeStatus={handleChange} value={selected} defaultValue={selected} initStatusValue={get(dataTask, 'statusId', {})} listStatus={boardById?.listStatusConfig} />
                    </Suspense>
                </Col>
                <Col style={{ marginRight: 8 }}>
                    <Text strong>#{get(dataTask, 'code', '')} </Text>
                </Col>
                <Col flex={1} style={{ marginRight: 8 }}>
                    {isLoading ? <Skeleton.Input active /> : <Input
                        type="text"
                        size="small"
                        style={{
                            height: 30,
                            fontSize: '18px',
                            fontWeight: 700
                        }}
                        value={inputValue}
                        onChange={handleInputChange}
                        onPressEnter={handleInputConfirm}
                    />}
                </Col>

                <Col style={{ width: 75, fontSize: 20, marginLeft: 10, height: 'var(--info-header)' }}>
                    <span style={{ marginRight: 15, color: '#222bd6f0' }}><ExportOutlined onClick={() => {
                        window.open(`/work-task-item/${idTask}`)
                    }} /></span>
                    <span style={{ color: '#d62247db' }}><CloseOutlined onClick={() => setVisibleInfo(false)
                    } className="button-remove-task" /></span>
                </Col>
            </Row>
            <div className="container-fluid view-port-info-main" style={{ overflow: 'scroll' }}>
                <TaskItem  idTask={idTask} />
            </div>
        </TaskItemProvider>
    );
}
