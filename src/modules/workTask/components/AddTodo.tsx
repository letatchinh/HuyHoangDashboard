import { Button, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { get } from 'lodash';
import { useCallback, useState } from 'react';
import useTaskItemStore from '~/store/TaskItemContext';

interface Props {
  dataTask?: any;
  updateProgressTask?: any;
  setActiveAddTodo?: any
};

export default function AddTodo({ dataTask,updateProgressTask,setActiveAddTodo }: Props) {
    const {assign : {canAssign}} = useTaskItemStore();

    const [text,setText] = useState('');
    const {progressList = []} = dataTask;
    const onAdd = useCallback(() => {
        const newProgressList =
        {
            progress: [],
            name: text || "(Công việc)"
        }
        
        const submitData = [...progressList, newProgressList];
        updateProgressTask({
            id: get(dataTask, '_id'),
            progressList: submitData
        });
        setActiveAddTodo(false)
        setText('');
    }, [text]);
    
    return (
        <div className='addTodo--container'>
            <h5>Thêm công việc</h5>
            <TextArea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                allowClear
                autoFocus
                placeholder='Nhập nội dung công việc'
            />
            <Button disabled={!text} onClick={onAdd} type='primary'>Thêm</Button>
        </div>
    )
}
