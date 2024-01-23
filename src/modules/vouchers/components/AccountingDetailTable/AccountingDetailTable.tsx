import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';

import { get } from 'lodash';
import { Button, InputNumber, Space, Table, Tooltip } from 'antd';

import { ACCOUNTS, COMPONENT_MODES } from '~/constants/defaultValue';
import { InfoCircleOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusSquareOutlined } from '@ant-design/icons';
import './index.scss'
import { floorFormatter, formatNumberThreeComma } from '~/utils/helpers';


interface Props{
  dataSource?: any;
  mode?: string;
  whAppointment?: any;
  isShowSuggest?: boolean;
}
const AccountingDetails = forwardRef(({
  dataSource,
  mode,
  whAppointment,
  isShowSuggest,
}: Props, ref) => {
  const [clonedDataSource, setClonedDataSource] = useState<object[] | null>([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    // if (Array.isArray(dataSource)) {
    //   setClonedDataSource(dataSource?.map((item, index) => ({
    //     ...item,
    //     key: index,
    //   })))
    //   setCount(dataSource?.length);
    // }
  }, [dataSource]);

  const columns = [
    {
      display: "editOnly",
      width: 200,
      title: 'Diễn giải',
      dataIndex: 'content',
      key: 'content',
      render: (text : any, record : any, index : number) => text || "(Chưa nhập diễn giải)",
      editable: true,
      component: 'Input',
    },
    {
      // display: "editOnly",
      width: 250,
      title: 'TK Nợ',
      dataIndex: 'debitAccount',
      key: 'debitAccount',
      render: (text : any, record : any, index: number) => text ? `${text} - ${ACCOUNTS[text]}` : "(Chưa chọn tài khoản)",
      editable: true,
      component: 'Select',
      options: Object.keys(ACCOUNTS).map(key => ({ value: key, label: `${key} - ${ACCOUNTS[key]}` })),
    },
    {
      // display: "editOnly",
      title: 'TK Có',
      width: 250,
      dataIndex: 'creditAccount',
      key: 'creditAccount',
      render: (text : any, record : any, index: number) => text ? `${text} - ${ACCOUNTS[text]}` : "(Chưa chọn tài khoản)",
      editable: true,
      component: 'Select',
      options: Object.keys(ACCOUNTS).map(key => ({ value: key, label: `${key} - ${ACCOUNTS[key]}` })),
    },
    {
      title: (
        isShowSuggest ?
          <Tooltip className='wh-payment-voucher__tooltip'
            style={{ cursor: 'pointer' }}
            title={`Số tiền phải trả cho khách hàng(nếu có) là: ${whAppointment?.length && formatNumberThreeComma(whAppointment[0]?.reduced?.prepay)}đ /buổi hẹn`}
            trigger={'hover'}
            placement="topLeft">
            <span> Số tiền</span>
            <InfoCircleOutlined style={{ marginLeft: 5 }} /> 
        </Tooltip>
          : 'Số tiền'
      ),
      align: 'right',
      width: 200,
      dataIndex: 'amountOfMoney',
      key: 'amountOfMoney',
      render: (text: any) => floorFormatter(text),
      editable: true,
      component: 'InputNumber',
    },
    {
      render: (text : any, record : any, index: number) => {
        if (index > 0) {
          return (
            <MinusCircleOutlined
              onClick={() => handleDelete(index)}
            />
          )
        }
      }
    },
  ];

  const components = {
    // body: {
    //   row: EditableRow,
    //   cell: EditableCell,
    // },
  };

  const tableProps = {
    // override default components to editable components in edit mode
    // ...(mode === COMPONENT_MODES.EDIT && { components }),
    ...(true && { components }),

    // pass extra props to every single editable cell in edit mode
    // columns: mode === COMPONENT_MODES.EDIT ?
    columns: true ?
      columns.filter((col: any) => !col.display || col.display !== "viewOnly")
        .map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record: any, rowIndex: number) => {
              let options = null;
              let optionsLoading = null;
              let triggerFetchingOptions = null;
              let availableTime = null;

              if (col.options) {
                options = col.options;
              };
              // if (col.computedOptions) {
              //   options = get(record, col.computedOptions)
              // };

              return {
                record,
                rowIndex,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,

                component: col.component,
                options,
                optionsLoading,
                triggerFetchingOptions,
                availableTime,
                handleSave,
              }
            },
          };
        }) : columns.filter(col => !col.display || col.display !== "editOnly"),

    // use cloned data source so that it can be submitted when complete
    dataSource: mode === COMPONENT_MODES.EDIT
      ? clonedDataSource
      : dataSource,
  }
  const handleAdd = () => {
    const newData = {
      key: count,
      content: null,
      debitAccount: null,
      creditAccount: null,
      amountOfMoney: 0,
    };
    // setClonedDataSource([...clonedDataSource, newData]);
    setCount(count + 1);
  }

  const handleDelete = (index: number) => {
    // const newData = clonedDataSource.filter((item, idx) => idx !== index);
    // setClonedDataSource(newData);
  };

  const handleSave = (row: any, dataIndex: number) => {
    // const newData = [...clonedDataSource];
    // const index = newData.findIndex((item) => row.key === item.key);
    // const item = newData[index];

    // const computedRow = {
    //   ...row,
    // }
    // newData.splice(index, 1, { ...item, ...computedRow });
    // setClonedDataSource(newData);
  };

  const renderSummary = (pageData: any) => {
    // const totalAmountOfMoney = pageData.reduce((prev, curr) => {
    //   return prev + Number(get(curr, "amountOfMoney"));
    // }, 0);

    // return (
    //   <Table.Summary.Row>
    //     <Table.Summary.Cell align="right" colSpan={mode === COMPONENT_MODES.EDIT ? 4 : 4}>
    //       <h5>Tổng cộng</h5>
    //       <h5>{floorFormatter(totalAmountOfMoney)}</h5>
    //     </Table.Summary.Cell>
    //   </Table.Summary.Row>
    // )
  }

  useImperativeHandle(ref, () => ({
    getAccountingDetailsData() {
      return clonedDataSource;
    }
  }));

  return (
    <Space direction='vertical'>

      <Button
        // disabled={form.getFi eldValue("services").length >= whServices.length}
        icon={<PlusCircleOutlined />}
        onClick={handleAdd}
      >
        Thêm dòng
      </Button>
      <Table
        // {...tableProps}
        // footer={null}
        pagination={false}
        scroll={{ x: 1000}}
        size="small"
        // summary={renderSummary}
      />
    </Space>
  )
})

export default AccountingDetails;
