import { Button, Flex, GetProps, Table, Tag } from "antd";
import React from "react";
import { Context } from "../../context";
import WhiteBox from "~/components/common/WhiteBox";
import type { TestModal } from "../../";
import HeadList from "./HeadList";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

type ComponentType = GetProps<typeof Table<TestModal>>
type ColumnsType = ComponentType['columns']
function Actions({}:TestModal){
    return (
        <Flex justify="center" gap={10}>
            <Button size="small" block type="primary" icon={<InfoCircleOutlined/>} >Chi tiết</Button>
            <Button size="small" block type="dashed" icon={ <DeleteOutlined/>} danger>Xoá</Button>
        </Flex>
    )
}




export default function TableTestList(
  props: ComponentType
): React.JSX.Element {
  const { paging, dataSource,dataSourceLoading } = Context.useContainer();
  const columns: ColumnsType= [
    {
        title:'STT',
        width: 30,
        align: 'center',
        render:(e,v,i)=>i+1
    },
    {
        title: 'Tên'
    },
    {
        title: 'Hình thức',
        dataIndex:'category',
        width:250,
        render:(value,{categoryId})=><Tag style={{width:100, textAlign:'center'}} color={categoryId===1?"orange":'blue'}>{value}</Tag>
    },
    {
        title: 'Thao tác',
        fixed: 'right',
        align:'center',
        width: 150,
        render:(v,record)=><Actions {...record}/>
    }
  ];
  return (
    <WhiteBox>
        <HeadList/>
        <Table<TestModal>
          {...{
            columns,
            loading: dataSourceLoading,
            bordered: true,
            size:'small',
            dataSource:[
                {
                    _id: '1',
                    category: 'Nghe - Đọc',
                    categoryId:1
                },
                {
                    _id: '2',
                    category: 'Nói - Viết',
                    categoryId: 2
                }
            ],
            scroll:{
                x: 'auto'
            },
            pagination: {
                style:{
                    marginBottom: 0
                },
              ...paging,
              ...props.pagination,
            },
            ...props,
          }}
        />
    </WhiteBox>
  );
}
