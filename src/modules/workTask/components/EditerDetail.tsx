import { Button, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
// import Editors from '~/utils/Editors';
interface Props {
  dataTask?: any
  onCancel?: any
  handleFinshed?: any
};

export default function EditerDetail({ dataTask, onCancel, handleFinshed }: Props) {
    console.log('first')
    const [inputValue, setInputValue] = useState('');
    const handleCancel = useCallback(() => {
        setInputValue(dataTask?.description || "");
        onCancel();
    },[onCancel])
    useEffect(() => {
        setInputValue(dataTask?.description);
    }, [dataTask]);
    const handleOk = () => {
        handleFinshed(inputValue,'description')
        onCancel()
    }
    
    return (
        <div className='flex-column-center'>
            {/* <Editors
                value={inputValue}
                onChange={(e: any) => {
                    setInputValue(e)
                }
                }
            /> */}
            <Row style={{marginLeft : 'auto'}}>
                <Button onClick={handleOk} type='primary' style={{ width: 100 }}>Lưu</Button>
                <Button onClick={handleCancel} style={{ width: 100 }}>Huỷ</Button>
            </Row>
        </div>
    )
}
