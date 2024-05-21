import React from "react"
import LoadingTree from "~/components/Antd/LoadingTree"

export function LoadTree ({loading,children,current,pageSize}:{loading:boolean,children:React.JSX.Element,current?:number,pageSize?:number}){
    if(loading) return <LoadingTree sample={{current,pageSize}} />
    return children
}
 