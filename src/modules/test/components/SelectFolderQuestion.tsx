import { Flex, Select } from 'antd';
import { filter, uniqBy } from 'lodash';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { FormItem } from './FormTest';
import { LabelStrong } from './QuestionTest';
type propsType = {
    name:number
}

const ContextFolderQuestion = createContext({
    options:[],
    setOption: null as React.Dispatch<React.SetStateAction<any[]>>
});
export const FolderQuestion = (p:PropsWithChildren)=>{
    const [ options, setOption ]= useState([
        {
            value:'PART 1',
            label:'PART 1',
        }
    ])
    
    return <ContextFolderQuestion.Provider value={{
        options,
        setOption
    }}>
        {p.children}
    </ContextFolderQuestion.Provider>
}
FolderQuestion.Consumer = ContextFolderQuestion.Consumer;


export default function SelectFolderQuestion({name}:propsType) : React.JSX.Element {
    const [ valueSearch, setValueSearch] = useState('')
    const { options, setOption } = useContext(ContextFolderQuestion);
    return (
        <Flex align='center' gap={10}>
            <LabelStrong>Mục:</LabelStrong>
            <FormItem name={[name,'tag']}>
                <Select
                    defaultValue={options.at(-1).value}
                    variant='underlined'
                    showSearch
                    style={{ width: 200 }}
                    placeholder= "Chọn mục ex: PART"
                    onSearch={(value)=>{
                        setValueSearch(value)
                    }}
                    onSelect={(value,option)=>{
                        setOption((old)=>uniqBy([...old,option],'value'))
                    }}
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={filter(uniqBy(options.concat({
                        value: valueSearch.toUpperCase(),
                        label: valueSearch
                    }),'value'),'value')}
                />
            </FormItem>

        </Flex>
    )
}