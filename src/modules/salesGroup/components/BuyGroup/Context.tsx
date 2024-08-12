/* eslint-disable import/no-anonymous-default-export */
import React, { createContext, useContext, useEffect, useState } from 'react';
import ChildrenTabBuyGroup from './ChildrenTabBuyGroup';
// import { contextReport } from '../reportSalaryPartner.hook';

type propsType = {
    children:any,
    activeKey:'B2C'|'B2B'
}
export const contextBuyGroup = {
    provider: createContext({
        drawerOpen:false,
        setDrawerOpen(value:any){},
        selectId:'',
        objectsSelectId:{},
        setSelectId(value?:any){},
        listSelect:[] as {
            label: string,
            children?: any,
            key: string,
            closable: boolean,
        }[],
        clearContextDrawer(){},
        setListSelect: (value?:any)=>{} ,
        setObjSelectId: (value?:any)=>{} ,
    }),
    get useContextBuyGroup() {
      return useContext(this.provider);
    },
  };
  
const Provider = contextBuyGroup.provider;

export default {
    Provider: function (props:propsType) : React.JSX.Element {

        const [drawerOpen, setDrawerOpen] = useState(false);
        const [selectId, setSelectId] = useState('');
        const [objectsSelectId, setObjSelectId] = useState<Record<string,{label:string,id:string,targetType:'partner'|'employee'}>>({});
        const [listSelect, setListSelect] = useState<Array<{
            label: string,
            children?: any,
            key: string,
            closable: boolean,
        }>>([]);

        const clearContextDrawer = ()=>{
            setDrawerOpen(false);
                setListSelect([]);
                setSelectId('');
        }
        useEffect(()=>{
            if(props.activeKey!=='B2C'){
                clearContextDrawer()
            }
        },[props.activeKey])

        useEffect(()=>{
           if(selectId){
            
            setListSelect((old:any[])=>{
                const currentValue = [{
                    label : objectsSelectId[selectId]?.label??'unknown',
                    key: selectId,
                    closable: true,
                    children: <ChildrenTabBuyGroup 
                        targetId={selectId} 
                        targetType={objectsSelectId[selectId]?.targetType??'partner'}
                        />
                }]
                const filter = currentValue.filter(({key})=>!old.some(({key:old_key}:any)=>old_key===key))
                return filter.concat(old)
            })
           }
        },[selectId,setListSelect,objectsSelectId])
            return (
                <Provider.Provider value={{
                    setDrawerOpen,
                    drawerOpen,
                    selectId,
                    setSelectId,
                    listSelect,
                    setListSelect,
                    objectsSelectId,
                    setObjSelectId,
                    clearContextDrawer,
                }}>{props.children}</Provider.Provider>
            )
        },
    Consumer: Provider.Consumer
}
