import Text from 'antd/lib/typography/Text';
import React, { useCallback, useState } from 'react'
import useTaskItemStore from '~/store/TaskItemContext';
import EditerDetail from './EditerDetail';

interface Props {
  dataTask?: any;
  handleFinshed?: any;
};
export default function Description({ dataTask, handleFinshed }: Props) {
    const {assign} = useTaskItemStore();
    const [isEdit, setIsEdit] = useState(false);

    const onToggleEdit = useCallback(() => {
        // if(!canAssign){
        //   return  toastr.error("Bạn phải là quản lý mới được cập nhật")
        // }
        setIsEdit(!isEdit);
    }, [isEdit]);

    const onCancel = useCallback(() => {
        setIsEdit(false);
    }, []);
    return (
      <>
          <div style={{ display: isEdit ? 'block' : 'none' }}>
            <EditerDetail key={'Edittor'} onCancel={onCancel} handleFinshed={handleFinshed} dataTask={dataTask} />
          </div>
          {!isEdit &&
            (dataTask?.description ? (
              <div className="ck ck-reset ck-editor ck-rounded-corners previewDescription" role="application" dir="ltr" lang="en" onClick={onToggleEdit} >
                <div className="ck ck-editor__main" role="presentation">
                  <div className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" role="textbox"
                    dangerouslySetInnerHTML={{
                      __html: dataTask?.description
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="previewDescription" onClick={onToggleEdit}>
                {!dataTask?.description && (
                  <Text type="secondary">
                    Ghi chú công việc: Click để Edit...
                  </Text>
                )}
              </div>
            ))}
      </>

    );
}
