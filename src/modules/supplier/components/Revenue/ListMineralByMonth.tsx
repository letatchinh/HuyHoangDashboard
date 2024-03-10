import React, { useEffect, useMemo, useState } from 'react';
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
  const [count, setCount] = useState<number>();
  let monthsArray = useMemo(() => {
    return getMonthsBetweenDates(dateTime)
  }, [dateTime]);

  useEffect(() => {
    console.log(listMineralByMonth?.length,'listMineralByMonth?.length')
    if (!listMineralByMonth?.length) {
      const newData = monthsArray?.map((item: any, index: any) => ({
        startDate: item?.startDate,
        endDate: index === monthsArray?.length - 1 ? dayjs(dateTime?.endDate).format('DD-MM-YYYY') : item?.endDate,
        revenue: 0
      }));
      setData([...newData]);
      setListMineralByMonth(newData);
    } else {
      setData(listMineralByMonth);
    };
  }, [dateTime, monthsArray]);

  useEffect(() => {
    setCount(totalRevenue);
  }, [totalRevenue]);

  useEffect(() => {
    if (data?.length) {
      setListMineralByMonth(data);
    };
  }, [data]);

  useEffect(() => {
    const newData = listMineralByMonth?.map((item: any, index: any) => {
      if (index === 0) {
        return {
          ...item,
          startDate: dayjs(dateTime?.startDate).format('DD-MM-YYYY'),
        }
      };
      if(index === data?.length - 1) {
        return {
          ...item,
          endDate: dayjs(dateTime?.endDate).format('DD-MM-YYYY'),
        }
      };
      return item;
    });
    setListMineralByMonth(newData);
  },[dateTime])

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
          parser={value => value?.replace(/\$\s?|(,*)/g, '')}
          min={0}
          onBlur={(e) => {
            const revenue = parseFloat(e.target.value.replace(/\$\s?|(,*)/g, '')) || 0; 
            const newData = data?.map((item: any, index_: any) => {
              if (index_ === index) {
                return {
                  ...item,
                  revenue: revenue
                };
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
    <span style={{opacity: 0.5}}>Lưu ý: Nếu bạn thay đổi giá trị thời gian thì doanh số khoán theo tháng sẽ bị cài đặt lại</span>
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

export function getMonthsBetweenDates(dateTime: any) {
  let months = [];
  let currentDate : any = new Date(dateTime?.startDate);
  while (currentDate <= dayjs(dateTime.endDate)) {
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    let year = currentDate.getFullYear();
    // let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let lastDayOfMonth = dayjs(currentDate).endOf('month').date()
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

export function newListMineralByMonth(dateTime: any) {
  let monthsArray = getMonthsBetweenDates(dateTime);
  const newData = monthsArray?.map((item: any, index: any) => ({
    startDate: item?.startDate,
    endDate: index === monthsArray?.length - 1 ? dayjs(dateTime?.endDate).format('DD-MM-YYYY') : item?.endDate,
    revenue: 0
  }));
  return newData;
};
