import { Col, Row, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import { useRevenueContext } from '.';
import apis from '../../supplier.api';
import useNotificationStore from '~/store/NotificationContext';
import { get } from 'lodash';
import { formatNumberThreeComma } from '~/utils/helpers';
const { RangePicker } = DatePicker;

interface MonthData {
  duration: string;
  DSK: number;
  DT: number;
}

interface ColumnChartProps {
  data: MonthData[];
}

const ColumnChart: React.FC<ColumnChartProps> = ({ data }) => {
  const series = [
    {
      name: 'Doanh số khoán', data: data?.map(month => (month.DSK)), color: '#387ADF' },
    { name: 'Doanh thu', data: data?.map(month => (month.DT)) , color: '#27e26c' },
  ];

  // const options = {
  //   chart: {
  //     type: 'bar',
  //     toolbar: {
  //       show: false // Ẩn thanh công cụ
  //     },
  //   },
  //   xaxis: {
  //     categories: data?.map(month => month?.duration),
  //   },
  //   yaxis: {
  //     labels: {
  //       minWidth: 40, // Đặt minWidth cho các nhãn trục y
  //       maxWidth: 50,
  //       formatter: (val: any) => {
  //         return String(val).replace(/(.)(?=(\d{3})+$)/g, '$1.');
  //       },
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       columnWidth: '40px', // Đặt chiều rộng cột là 20px
  //       padding: '10px',
  //       dataLabels: {
  //         position: 'top', // Đặt vị trí nhãn dữ liệu
  //         style: {
  //           color: ['#ff0000'] // Thay đổi màu chữ ở đây
  //         },
  //         formatter: (val: any) => {
  //           return String(val).replace(/(.)(?=(\d{3})+$)/g, '$1.');
  //         },
  //       },
  //       barWidth: '90%',
  //     },
  //   },
  //   stroke: {
  //     width: [0, 4],
  //     colors: ['#27e26c']
  //   },
  // };
  const options = {
    fill: {
      colors: ['blue']
    },
    chart: {
      type: 'column',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40px',
        padding: '10px',
      }
    },
    stroke: {
      width: [0, 4],
      colors: ['#27e26c']
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data?.map(month => month?.duration),
      labels: {
        trim: true,
        rotateAlways: true,
        rotate: -45
      }
    },
    yaxis: [
      {
        title: {
          // text: ''
        },
        labels: {
          formatter: (val: any) => {
            return String(val).replace(/(.)(?=(\d{3})+$)/g, '$1.');
          }
        }
      }
    ]
  };
  return (
    <div style={{ overflowX: 'auto' }}>
    <ReactApexChart
      options={options as ApexCharts.ApexOptions}
      series={series}
      type="bar"
      height={350}
      style={{ minWidth: '1000px' }} 
    />
  </div>
  );
};

interface propsType {
  totalRevenueId: any;
  dateTime: any;
};

export default function RevenueChart(props: any) {
  const { dateTime: dateTimeContext} = useRevenueContext();
  const { onNotify} = useNotificationStore();
  const { totalRevenueId } = props;
  const { id } = useParams();
  const monthFormat = 'MM-YYYY';
  const dateFormat = 'YYYY-MM-DD';

  const defaultDateTime = {
    startDate: dayjs().startOf('year').format(dateFormat),
    endDate: dayjs().endOf('year').format(dateFormat),
  };

  const [dateTime, setDateTime] = useState<any>();
  const [data, setData] = useState<any>([]);
  const query = useMemo(() => ({
    id,
    supplierMineralId: totalRevenueId,
    startDate: dateTime?.startDate,
    endDate: dateTime?.endDate,
  }), [totalRevenueId, id, dateTime]);

  const getData = async () => {
    try {
      const res = await apis.getReport(query);
      const newData = res?.map((item: any) => ({
        duration: item?.duration,
        DSK: get(item,'revenue',0),
        DT:  get(item, 'totalCumulative', 0),
      }));
      setData([...newData]);
    } catch (error) {
      onNotify?.error('Có lỗi gì đó đã xảy ra khi lấy dữ liệu');
    }
  };
  // const data: MonthData[] = [
  //   { month: 'Tháng 1', DSK: 200, DT: 200 },
  //   { month: 'Tháng 2', DSK: 250, DT: 250 },
  //   { month: 'Tháng 3', DSK: 350, DT: 250 },
  //   { month: 'Tháng 4', DSK: 250, DT: 250 },
  //   { month: 'Tháng 5', DSK: 450, DT: 250 },
  //   { month: 'Tháng 6', DSK: 350, DT: 250 },
  //   { month: 'Tháng 7', DSK: 450, DT: 250 },
  //   { month: 'Tháng 8', DSK: 350, DT: 250 },
  //   { month: 'Tháng 9', DSK: 650, DT: 250 },
  //   { month: 'Tháng 10', DSK: 550, DT: 250 },
  //   { month: 'Tháng 11', DSK: 550, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 9', DSK: 650, DT: 250 },
  //   { month: 'Tháng 10', DSK: 550, DT: 250 },
  //   { month: 'Tháng 11', DSK: 550, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  //   { month: 'Tháng 12', DSK: 350, DT: 250 },
  // ];
  useEffect(() => {
    if (dateTimeContext) {
      setDateTime({
        startDate: dayjs(dateTimeContext.startDate).format(dateFormat),
        endDate: dateTimeContext.endDate ? dayjs(dateTimeContext.endDate).format(dateFormat):  dayjs().endOf('year').format(dateFormat),
      });
    } else {
      setDateTime(defaultDateTime);
    };
  }, [dateTimeContext]);

  useEffect(() => {
    if (dateTime) {
      getData();
    };
  }, [query]);

  return (
    <div>
      <h3>Báo cáo doanh số khoán và doanh thu theo tháng</h3>
      {/* <Row>
        <Col flex={1}>
          <RangePicker 
            style={{ width: '400px', maxWidth: '500px' }} picker="month"
            format={monthFormat}
            onChange={(date: any) => setDateTime({ startDate: date[0].format(monthFormat), endDate: date[1].format(monthFormat) })}
            defaultValue={dateTime ? [dayjs(dateTime.startDate, monthFormat), dayjs(dateTime.endDate, monthFormat)] : undefined}
          />
        </Col>
      </Row> */}
      <ColumnChart data={data} />
    </div>
  );
};