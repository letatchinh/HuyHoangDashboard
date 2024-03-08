import React, { useEffect, useState } from 'react';
import { useRevenueContext } from '.';
import dayjs from 'dayjs';
import TableAnt from '~/components/Antd/TableAnt';
import { InputNumber } from 'antd';
import { formatNumberThreeComma, formatter } from '~/utils/helpers';
type propsType = {
};
export default function ListMineralByMonth({}: propsType): React.JSX.Element {
  const { dateTime, totalRevenue ,setListMineralByMonth, listMineralByMonth} = useRevenueContext();
  const [data, setData] = useState<any>([]);
  console.log(listMineralByMonth,'listMineralByMonth')
  const [count, setCount] = useState<number>();
  let monthsArray = getMonthsBetweenDates(dateTime);
  useEffect(() => {
    if (!listMineralByMonth.length) {
      const newData = monthsArray?.map((item: any) => ({
        ...item,
        revenue: 0
      }));
      setData([...newData]);
      const newList = data?.map((item: any) => {
        return {
          ...item,
          revenue: Number(item?.revenue)
        }});
      setListMineralByMonth(newList);
    } else {
      setData(listMineralByMonth);
    };
  }, [dateTime]);

  useEffect(() => {
    setCount(totalRevenue);
  }, [totalRevenue]);

  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render (value: any, rc: any, index: any) {
        return (
          <span>{`${rc?.startDate} đến ${rc?.endDate}`}</span>
        )
      }
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render(value: any, rc: any, index: any) {
        return (
          <InputNumber
            value={value}
            style={{ width: "100%" }}
            formatter={value => formatNumberThreeComma(value)}
            min={0}
            onBlur={(e) => {
              const revenue = e.target.value;
              const newData = data?.map((item: any, index_: any) => {
                if (index_  === index) {
                  return {
                    ...item,
                    revenue: revenue
                  }
                }
                return item;
              });
              setData([...newData]);
            }}
          />
        )
      }
    },
  ];

  return (
    <>
    <h6>Doanh số khoán chi tiết theo tháng:</h6>
    <TableAnt
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ y: 300 }}
      bordered
      size="small"
    />
    </>
  )
};

function getMonthsBetweenDates(dateTime: any) {
  let months = [];
  let currentDate : any = new Date(dateTime?.startDate);
  while (currentDate <= dayjs(dateTime.endDate)) {
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    let year = currentDate.getFullYear();
    let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let newEndDateOfMonth = `${lastDayOfMonth}-${month}-${year}`;
    months.push({
      startDate: `${date}-${month}-${year}`,
      endDate:  newEndDateOfMonth ,
    });
      currentDate.setMonth(month); // Chuyển sang tháng tiếp theo
      currentDate.setDate(1); // Đặt ngày thành ngày đầu tiên của tháng
  };
  return months;
};
