/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { contextBuyGroup } from './Context';
import { Tabs } from 'antd';
type propsType = {

}
export default function DrawerBuyGroup(props:propsType) : React.JSX.Element {
    const {selectId,listSelect ,setListSelect,setSelectId} = contextBuyGroup.useContextBuyGroup;

    const [activeKey,setActiveKey]=useState(selectId);
    
    useEffect(()=>{
        setActiveKey(selectId)
    },[selectId,setActiveKey]);

    const  onEdit = (targetKey:any, action: "add" | "remove")=>{
        setListSelect((list:any)=>{
            let newList = list.filter(({key}:any)=>key !== targetKey);
            let selectKey = newList[newList.length-1]?.key
            setActiveKey(selectKey);
            setSelectId(selectKey);
            return newList
        })
    }

    return (
        <div className='drawer-buy-group-container'>
            <Tabs
                destroyInactiveTabPane
                type="editable-card"
                onChange={setActiveKey}
                activeKey={activeKey}
                onEdit={onEdit}
                hideAdd
                items={listSelect}
            />
        </div>
    )
}