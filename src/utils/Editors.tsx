import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
interface PropsEditor {
  value?: any,
  onChange?: any
};

function Editors({ value, onChange }: PropsEditor) {
    return (
        <CKEditor
            id={'ckEditor5-editor'}
            editor = {CustomEditor as any}
            data={value??''}
            onChange={(_ : any, editor : any) => {
            onChange(editor.getData());
          }}
        />        
    )
};

export default Editors;
