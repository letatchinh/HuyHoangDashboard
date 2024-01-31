import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import dayjs from "dayjs";
import { clone, get } from "lodash";
import { SearchByType } from "../supplier.modal";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { formatter } from "~/utils/helpers";
import { Empty, Space, Spin } from "antd";
dayjs.extend(quarterOfYear)
type propsType = {
    data : any,
    searchBy : SearchByType,
    searchByVi : any,
    loadingBills : boolean,
};
type DataChartType = {
    unit : number,
    totalPrice : number
}
export default function ChartBill({data,searchBy,searchByVi,loadingBills}: propsType): React.JSX.Element {
    console.log(data,'data');
    
    const dataMap = useMemo(() => get(data,'bills',[])?.reduce((sum:DataChartType[],cur:any) => {
        const cloneSum = clone(sum);
        const {createdAt,totalPrice} = cur;
        let unit : any ;
        switch (searchBy) {
            case 'date':
                unit = dayjs(createdAt).format("DD-MM");
                break;
            case 'month':
                unit = "Ngày "+dayjs(createdAt).format("DD");
                break;
            case 'quarter':
                unit = "Tháng "+dayjs(createdAt).format("MM");
                break;
            case 'year':
                unit = "Tháng "+dayjs(createdAt).format("MM");
                break;
        
            default:
                break;
        }
        const indexUnit = sum?.findIndex((item) => get(item,'unit') === unit);
        if(indexUnit !== -1){
            const itemUpdate = {
                ...cloneSum[indexUnit],
                totalPrice : (cloneSum[indexUnit]?.totalPrice || 0) + totalPrice
            };
            cloneSum.splice(indexUnit,1,itemUpdate)
        }else{
            cloneSum.push({
                unit,
                totalPrice
            })
        };
        return cloneSum;
    },[]),[data])
  return (
      <div style={{ width: "80%", height: 500 , margin : '0 auto',position : 'relative'}}>
        {loadingBills && <Spin className="loadingFullContainer"/>}
        {get(data,'bills',[])?.length > 0 ?  <ResponsiveBar
        data={dataMap}
        keys={["totalPrice"]}
        indexBy="unit"
        valueFormat={(e) => formatter(e)}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}

        padding={0.6}
        colors={{ scheme: 'accent' }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: searchByVi,
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0,
        }}
        axisLeft={{
            format : (e) => formatter(e)
        }}
      /> : <Empty description="Không có dữ liệu"/>}
     
      </div>
  );
}
