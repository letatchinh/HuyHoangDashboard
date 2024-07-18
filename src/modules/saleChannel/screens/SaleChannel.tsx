import React, { useCallback, useMemo, useState } from 'react';
import { useDeleteSaleChannel, useGetSaleChannels, useSaleChannelPaging, useSaleChannelQueryParams, useUpdateSaleChannel, useUpdateSaleChannelParams } from '../saleChannel.hook';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import useCheckBoxExport from '~/modules/export/export.hook';
import POLICIES from '~/modules/policy/policy.auth';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import WithPermission from '~/components/common/WithPermission';
import { Button, Checkbox, Col, Popconfirm, Radio, Row, Space, Switch, Typography } from 'antd';
import { get, omit } from 'lodash';
import { STATUS, STATUS_NAMES } from '~/constants/defaultValue';
import { useChangeDocumentTitle } from '~/utils/hook';
import Breadcrumb from '~/components/common/Breadcrumb';
import Search from 'antd/es/input/Search';
import { PlusCircleOutlined } from '@ant-design/icons';
import ExportExcelButton from '~/modules/export/component';
import WhiteBox from '~/components/common/WhiteBox';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import SaleChannelForm from './SaleChannelForm';
import { Link } from 'react-router-dom';
import { PATH_APP } from '~/routes/allPath';
import BtnAdd from '~/components/common/Layout/List/Header/BtnAdd';
import DropdownAction from '~/components/common/Layout/List/Header/DropdownAction';
import StatusAndSearch from "~/components/common/StatusAndSearch";
type propsType = {

}
export default function SaleChannel(props:propsType) : React.JSX.Element {
  const [query] = useSaleChannelQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateSaleChannelParams(query);
  const [pharmacies, isLoading] = useGetSaleChannels(query);
  const [destroy,setDestroy] = useState(false);
  const onCloseForm = useCallback(() => {
    setSaleChannelId(null);
    setIsOpenForm(false);
  }, []);

  const [, updateSaleChannel] = useUpdateSaleChannel(onCloseForm);
  const [isSubmitLoading, deleteSaleChannel] = useDeleteSaleChannel();
  const [saleChannelId, setSaleChannelId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const paging = useSaleChannelPaging();
  const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_SALESCHANNEL);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_SALESCHANNEL);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setSaleChannelId(id);
        setDestroy(true);
      }
      setIsOpenForm(true);
    },
    [setSaleChannelId, setIsOpenForm]
  );

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã kênh bán hàng",
        dataIndex: "code",
        key: "code",
        width: 120,
        render: (text: string, record: any) => <Link className='link_' to={PATH_APP.saleChannel.root + "/" + record?._id}>{text}</Link>
      },
      {
        title: "Tên kênh bán hàng",
        dataIndex: "title",
        key: "title",
        width: 250,
      },
      {
        title: "Phân hệ",
        dataIndex: "customerDivision",
        key: "customerDivision",
        width: 120,
        render: (record) => {
          return get(record, "title");
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Trạng thái",
        key: "status",
        dataIndex: "status",
        width: 100,
        align: "center",
        render: (status, record) => {
          return (
            <WithPermission permission={POLICIES.UPDATE_SALESCHANNEL}>
              <Switch
                checked={status === "ACTIVE"}
                onChange={(value) =>
                  onChangeStatus(
                    get(record, "_id"),
                    value ? STATUS["ACTIVE"] : STATUS["INACTIVE"],
                    isLoading,
                    record
                  )
                }
              />
            </WithPermission>
          );
        },
      },
      {
        title: "Thao tác",
        dataIndex: "_id",
        // key: "actions",
        width: 100,
        align: "center",
        render: (record) => {
          return (
            <div className="custom-table__actions">
              <WithPermission permission={POLICIES.UPDATE_SALESCHANNEL}>
                <p onClick={() => onOpenForm(record)}>Sửa</p>
              </WithPermission>
              <WithPermission permission={POLICIES.DELETE_SALESCHANNEL}>
                <p>|</p>
                <Popconfirm
                  title={`Bạn muốn xoá kênh bán hàng này?`}
                  onConfirm={() => deleteSaleChannel(record)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <p>Xóa</p>
                </Popconfirm>{" "}
              </WithPermission>
            </div>
          );
        },
      },
      ...(
        canDownload ? [
          {
            title: 'Lựa chọn',
            key: '_id',
            width: 80,
            align: 'center' as any,
            render: (item: any, record: any) => {
              const id = record._id;
              return (
                <Checkbox
                  checked={arrCheckBox.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />)
            }
          },
        ] : []
      ),
    ],
    [canDownload,arrCheckBox]
  );

  const onChangeStatus = (
    _id: any,
    status: any,
    isSubmitLoading: any,
    record: any
  ) => {
    updateSaleChannel({
      _id,
      status,
      isSubmitLoading,
      ...omit(record, ["_id", "status"]),
    });
  };

  const onChange = ({ target }: any) => {
    switch (target.value) {
      case 2:
        onParamChange({ ...query, status: STATUS["ACTIVE"] });
        break;
      case 3:
        onParamChange({ ...query, status: STATUS["INACTIVE"] });
        break;
      default:
        onParamChange({ ...query, status: "" });
        break;
    }
  };
  useChangeDocumentTitle("Danh sách kênh bán hàng")
  return (
    <div>
      <Breadcrumb title={"Kênh bán hàng"} />
      <Row gutter={16} justify={"space-between"}>
        <Col span={12}>
          <StatusAndSearch
            onParamChange={onParamChange}
            query={query}
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16}>
            <WithPermission permission={POLICIES.WRITE_SALESCHANNEL}>
              <Col>
                <BtnAdd onClick={() => onOpenForm()} />
              </Col>
            </WithPermission>
            <WithPermission permission={POLICIES.DOWNLOAD_SALESCHANNEL}>
              <Col>
                <DropdownAction
                  items={[
                    <ExportExcelButton
                      fileName="Danh sách kênh bán hàng"
                      api="sales-channel"
                      exportOption="salesChannel"
                      query={query}
                      ids={arrCheckBox}
                      useLayout="v2"
                    />,
                  ]}
                />
              </Col>
            </WithPermission>
          </Row>
        </Col>
      </Row>
      <WhiteBox>
        <TableAnt
          dataSource={pharmacies}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
          stickyTop
        />
      </WhiteBox>
      <ModalAnt
        title={saleChannelId ? " Cập nhật kênh bán hàng" : "Thêm mới kênh bán hàng" } 
        width={700}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <SaleChannelForm
          setDestroy={setDestroy}
          onClose={onCloseForm}
          id={saleChannelId}
          handleUpdate={updateSaleChannel}
        />
      </ModalAnt>
    </div>
  );
}