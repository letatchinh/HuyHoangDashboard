import React, { useEffect, useMemo, useState } from 'react';
import { useGetListTotalRevenue, useGetRevenueId, useGetSupplier, useListTotalRevenuePaging, useListTotalRevenueQueryParams, useUpdateListTotalRevenueParams } from '../../supplier.hook';
import { ColumnsType } from 'antd/es/table';
import { formatNumberThreeComma } from '~/utils/helpers';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TableAnt from '~/components/Antd/TableAnt';
import { get } from 'lodash';
import { PATH_APP } from '~/routes/allPath';
import { useDispatch } from 'react-redux';
import { supplierSliceAction } from '../../redux/reducer';
import { Button, DatePicker, Row, Space } from 'antd';
import SelectSearch from '~/components/common/SelectSearch/SelectSearch';
import './index.scss'
type propsType = {

};
const { RangePicker } = DatePicker;
const dateFormat = 'DD-MM-YYYY';
export default function TotalRevenueList(props: propsType): React.JSX.Element {
  const [query,onTableChange] = useListTotalRevenueQueryParams();
  const {id : supplierId} = useParams();
  const [supplier, loading] = useGetSupplier(supplierId);
  const [data, isLoading] = useGetListTotalRevenue(query);
  const [keyword, {setKeyword, onParamChange}] = useUpdateListTotalRevenueParams(query);
  const paging = useListTotalRevenuePaging();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [date, setDate] = useState<any>();

  useEffect(() => {
    if (query) {
      setDate({
        startDate: query?.startDate,
        endDate: query?.endDate
      });
    };
  }, [query]);

  const handleDescription = async (value: any) => {
    await dispatch(supplierSliceAction.setRevenueIdAction(value?._id));
    return navigator(`${PATH_APP.revenueSupplier.root}/${supplierId}/detail/${value?._id}`);
  };
  const columns: ColumnsType  = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        render(value: any,rc, index: any) {
          return (query.page - 1) * query.limit + index + 1;
        }
      },
      {
        title: "Doanh số khoán",
        dataIndex: "totalRevenue",
        key: "totalRevenue",
        render(value, rc: any) {
          return formatNumberThreeComma(value);
        }
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
        render(value, rc: any) {
          return dayjs(value).format("DD-MM-YYYY");
        }
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "startDate",
        key: "startDate",
        render(value, rc: any) {
          return dayjs(value).format("DD-MM-YYYY");
        }
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render(value, rc: any) {
          return value
        }
      },
      {
        title: "Chi tiết",
        key: "decription",
        render(value, rc: any) {
          return (<Button type='link'
            onClick={() => {
              handleDescription(rc)
            }
            }
          >Xem chi tiết</Button>)
        }
      },
    ],
    [data]
  );

  return (
    <div>
        <h4>{loading ? "Đang tải..." : `Doanh số khoán của nhà cung cấp ${get(supplier, 'name', '')}`}</h4>
      <div className='supplier-revenue-list__header'>
        {/* <SelectSearch /> */}
        <Space className='supplier-revenue-list__header--date'>
          <h6 className='supplier-revenue-list__header--date-title'>Thời gian: </h6>
          <RangePicker
                  format={dateFormat}
                  allowEmpty={[false, false]}
                  value={[(date?.startDate ? dayjs(date?.startDate) : null), date?.endDate ? dayjs(date?.endDate) : null]}
                  onChange={(value) => {
                    setDate({
                      startDate: dayjs(value?.[0]).format("YYYY-MM-DD"),
                      endDate: dayjs(value?.[1]).format("YYYY-MM-DD"),
                    });
                  }}
                />
        </Space>
      </div>
      <TableAnt
      loading={isLoading}
      dataSource={data ?? []}
      onChange={onTableChange}
      columns={columns}
      size='small'
      pagination={{
        ...paging,
        showTotal: (total) => `Tổng cộng: ${total} `,
        showSizeChanger : true
      }}
    />
    </div>
  )
};