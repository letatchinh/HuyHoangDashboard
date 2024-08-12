import React, { useCallback, useMemo, useState } from 'react';
import { useDeleteTypePharmacy, useGetTypePharmacies, useTypePharmacyPaging, useTypePharmacyQueryParams, useUpdateTypePharmacy, useUpdateTypePharmacyParams } from '../typePharmacy.hook';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import useCheckBoxExport from '~/modules/export/export.hook';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { Button, Checkbox, Col, Popconfirm, Radio, Row, Space, Switch, Typography } from 'antd';
import { get, omit } from 'lodash';
import { STATUS, STATUS_NAMES } from '~/constants/defaultValue';
import { useChangeDocumentTitle } from '~/utils/hook';
import ExportExcelButton from '~/modules/export/component';
import WhiteBox from '~/components/common/WhiteBox';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import TypePharmacyForm from './TypePharmacyForm';
import Breadcrumb from '~/components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import { PATH_APP } from '~/routes/allPath';
import BtnAdd from '~/components/common/Layout/List/Header/BtnAdd';
import DropdownAction from '~/components/common/Layout/List/Header/DropdownAction';
import StatusAndSearch from '~/components/common/StatusAndSearch';
import ColumnAction from '~/components/common/ColumnAction';
type propsType = {

}
export default function TypePharmacy(props:propsType) : React.JSX.Element {
    const [query] = useTypePharmacyQueryParams();
    const [keyword, { setKeyword, onParamChange }] = useUpdateTypePharmacyParams(query);
    const [typePharmacies, isLoading] = useGetTypePharmacies(query);
    const [destroy,setDestroy] = useState(false);
    const onCloseForm = useCallback(() => {
      setTypePharmacyId(null);
      setIsOpenForm(false);
    }, []);
  
    const [, updateTypePharmacy] = useUpdateTypePharmacy(onCloseForm);
    const [isSubmitLoading, deleteTypePharmacy] = useDeleteTypePharmacy();
    const [typePharmacyId, setTypePharmacyId] = useState(null);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const paging = useTypePharmacyPaging();
    const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_CUSTOMERGROUP);
    const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_CUSTOMERGROUP);
    const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  
  
    const onOpenForm = useCallback(
      (id?: any) => {
        if (id) {
          setTypePharmacyId(id);
          setDestroy(true);
        }
        setIsOpenForm(true);
      },
      [setTypePharmacyId, setIsOpenForm]
    );
  
    const columns: ColumnsType = useMemo(
      () => [
        {
          title: "Mã nhánh khách hàng",
          dataIndex: "code",
          key: "code",
          width: 120,
          render: (text: string, record: any) => <Link className='link_' to={PATH_APP.typePharmacy.root + "/" + record?._id}>{text}</Link>

        },
        {
          title: "Tên nhánh khách hàng",
          dataIndex: "title",
          key: "title",
          width: 250,
        },
        {
          title: "Kênh bán hàng",
          dataIndex: "salesChannel",
          key: "salesChannel",
          width: 250,
          render: (record) => {
            return get(record, "title");
          }
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
              <WithPermission permission={POLICIES.UPDATE_CUSTOMERGROUP}>
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
          // dataIndex: "_id",
          key: "actions",
          width: 100,
          align: "center",
          render: (_, record) => {
            return (
              <ColumnAction
                onOpenForm={onOpenForm}
                onDelete={deleteTypePharmacy}
                _id={record?._id}
                textName="nhánh khách hàng"
                permissionUpdate={POLICIES.UPDATE_CUSTOMERGROUP}
                permissionDelete={POLICIES.DELETE_CUSTOMERGROUP}
              />
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
            render: (item: any, record: any) =>
            {
              const id = record._id;
              return (
                <Checkbox
                  checked= {arrCheckBox.includes(id)}
                  onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
            />)}
          },
        ]: []
      ),
      ],
      [arrCheckBox,canDownload]
    );
  
    const onChangeStatus = (
      _id: any,
      status: any,
      isSubmitLoading: any,
      record: any
    ) => {
      updateTypePharmacy({
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
    useChangeDocumentTitle("Danh sách nhánh khách hàng")
    return (
      <div>
        <Breadcrumb title={"Nhánh khách hàng"} />
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
              <WithPermission permission={POLICIES.WRITE_CUSTOMERGROUP}>
                <Col>
                  <BtnAdd onClick={() => onOpenForm()} />
                </Col>
              </WithPermission>
              <WithPermission permission={POLICIES.DOWNLOAD_CUSTOMERGROUP}>
                <Col>
                  <DropdownAction
                    items={[
                      <ExportExcelButton
                        fileName="DS nhánh khách hàng"
                        api="customer-group"
                        exportOption="customerGroup"
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
            dataSource={typePharmacies}
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
          />
        </WhiteBox>
        <ModalAnt
          title={
            typePharmacyId
              ? "Cập nhật nhánh khách hàng"
              : "Thêm mới nhánh khách hàng"
          }
          width={700}
          open={isOpenForm}
          onCancel={onCloseForm}
          footer={[]}
          afterClose={() => {
            setDestroy(false);
          }}
          destroyOnClose={destroy}
        >
          <TypePharmacyForm
            setDestroy={setDestroy}
            onClose={onCloseForm}
            id={typePharmacyId}
            handleUpdate={updateTypePharmacy}
            query={query}
          />
        </ModalAnt>
      </div>
    );
}