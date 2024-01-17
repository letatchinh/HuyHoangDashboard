import { CloseOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Input,
  Popconfirm,
  Row,
  Select,
  Space
} from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
// import { HISTORY_TASK_ITEM_TYPE, TASK_ITEM_STATUS_NAME } from '~/constants/defaultValue';
import { head, isArray, pull } from 'lodash';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { TASK_ITEM_STATUS_NAME, TaskItemStatusKey } from '~/constants/defaultValue';

export const useColumnsBoard = ({ handleOpenFormDetail }: any) => [
  {
    title: 'Tên nhóm',
    dataIndex: 'name',
    key: 'name',
    render: (value: any, record: any) => {
      return (
        <Button type="link" href={`/work-flow/sprint/${record._id}`} >
          {value}
        </Button>
      );
    }
  },
  {
    title: 'Người tạo',
    dataIndex: 'createBy',
    key: 'createBy',
    render: (_ : any, record : any) => <a>{record?.userCreate?.fullName}</a>,

  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (item: any, record: any, index : any) => moment(item)?.format('YYYY-MM-DD HH:mm')
  },
  {
    title: 'Xem chi tiết',
    key: 'detail',
    width: '130px',
    align: 'center',
    render: (_: any, record : any) => (
      <Space size="small"
      >
        <Button
          size="small"
          type="link"
          style={{ background: '#1890ff', borderRadius: '10px', color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenFormDetail(record?._id);
          }}
        >
          <span> Xem chi tiết</span>
        </Button>
      </Space>
    ),
  },
];
export const useActionColumn = ({ handleDelete, handleOpenUpdate }: any) => {
  return [
    {
      title: 'Hành động',
      key: 'action',
      width: '150px',
      align: 'center',
      render: (_ : any, record: any) => (
        <Space size="middle">
          <WithPermission permission={[]}>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenUpdate(record?._id);
              }}
            >
              <EditFilled />
            </Button>
          </WithPermission>
          <WithPermission permission={[]}>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá board này ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xác nhận"
              cancelText="Huỷ"
            >
              <DeleteFilled onClick={(e) => {
                e.stopPropagation();
              }} style={{ color: '#DC3535' }} />
            </Popconfirm>
          </WithPermission>
        </Space>
      ),
    },
  ]
}

export const HistoryRender = ({ value }: any) => {
  let content = <></>;
  const convertData = (data : any, index : any) => JSON.parse(data.historyAction[index] ?? JSON.stringify([]));
  const parsedData1 : any = convertData(value, 0);
  const parsedData2 : any  = convertData(value, 1);
  if (value) {
    switch (value?.action) {
      case 'assignUser':
        // let parsedData = convertData(value, 1);
        if (parsedData2 && parsedData2[0] && parsedData2[0]["Thêm"]) {
          let assignedUser = parsedData2[0]["Thêm"];
          content = (<h6>Thêm thành viên : {assignedUser}</h6>
          );
        }
        break;
      case 'status':
        var fromStatus  = TASK_ITEM_STATUS_NAME[parsedData1];
        var toStatus = TASK_ITEM_STATUS_NAME[parsedData2];
        content = (
          <div>
            <span>Từ: </span><span style={{ backgroundColor: fromStatus.bg, color: fromStatus.color }}>{fromStatus.value}</span>
            &emsp;&emsp;&emsp;
            <span>Thành: </span> <span style={{ backgroundColor: toStatus.bg, color: toStatus.color }}>{toStatus.value}</span>
          </div>
        );
        break;
      case 'description':
        var before = parsedData1;
        content = (
          <Collapse>
            <Collapse.Panel header="Ghi chú trước đó" key="1">
              <div className='ck ck-reset ck-editor ck-rounded-corners' role="application" dir="ltr" lang="en">
                <div className="ck ck-editor__main" role="presentation">
                  <div className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" role="textbox"
                    dangerouslySetInnerHTML={{
                      __html: before,
                    }} ></div>
                </div>
              </div>
              <hr style={{ margin: 5 }} />
            </Collapse.Panel>
          </Collapse>
        );
        break;
      case 'progressList':

        var baseConvert = (val: any) => {
          const title = Object.keys(val)[0]
          return <p>{title} nhóm công việc: <strong>{val?.[title] ?? ''}</strong></p>
        }
        content = (
          <div>
            {isArray(parsedData1) ? parsedData1.map(baseConvert) : ''}
            {isArray(parsedData2) ? parsedData2.map(baseConvert) : ''}
          </div>
        )
        break;
      case 'progressList.check':
        var title = Object.keys(parsedData1)[0];
        content = (<p>Cập nhật [ {title} ]: <span style={{ textDecoration: 'underline', color: 'blue', fontWeight: 500 }}>{parsedData1[title]}</span> thành <span style={{ textDecoration: 'underline', color: 'green', fontWeight: 500 }}>{parsedData2[title]}</span> </p>)
        break;
      case 'progressList.content':
        var title = Object.keys(parsedData1)[0];
        content = (<p>{title}: <span style={{ textDecoration: 'underline', color: 'blue', fontWeight: 500 }}>{parsedData1[title]}</span> thành <span style={{ textDecoration: 'underline', color: 'green', fontWeight: 500 }}>{parsedData2[title]}</span> </p>)
        break;
      case 'progressList.assgin':
        var baseConvert = (val: any) => {
          const title = Object.keys(val)[0]
          return <p>[ {title} ]: <span>{val?.[title] ?? ''}</span></p>
        }
        content = (
          <div>
            {isArray(parsedData1) ? parsedData1.map(baseConvert) : ''}
            {isArray(parsedData2) ? parsedData2.map(baseConvert) : ''}
          </div>
        )
        break;
      default:
        break;
    }
  }
  return content;
};

interface OptionFilterProps {
  value?: any
  setOptionsFilter?: any
  setQuery?: any
  query?: any
}
export const OptionFilter = ({ value, setOptionsFilter,setQuery,query }: OptionFilterProps) => {
  const optionDay = [
    { value: 'all', label: 'Tất cả' },
    { value: 'dayAfter', label: 'Trước ngày' },
    { value: 'dayBefore', label: 'Sau ngày' },
  ];

  const onSearch = (e: any, type: any) => {
    if (e) {
      console.log(e, type);
      setQuery({
        ...query,
        [type]: e
      })
    }console.log(query)
  };
  
  const handleRemoveFilter = (val: any) => {
    setOptionsFilter(value?.filter((item: any) => item !== val));
    const updatedQuery = Object.keys(query).reduce((acc: any, key) => {
      if (key !== val) {
        acc[key] = query[key];
      }
      return acc;
    }, {});
  
    setQuery(updatedQuery);
  };
  const renderInputRow = (label: string, placeholder: string, val: any) => (
    <div style={{ marginBottom: '10px' }}>
      <Row key={val}>
        <Col span={4}>
          <span>{label}</span>
        </Col>
        <Col span={8}>
          <Input
            placeholder={placeholder}
            style={{ maxWidth: '500px' }}
            onPressEnter={(e: any) => onSearch(e.target.value,val)}
            onChange={(e) =>
              setTimeout(() => {
                onSearch(e.target.value,val);
              }, 2000)
            }
          />
        </Col>
        <Col span={2}>
          <CloseOutlined
            style={{ color: 'red', margin: '9px 0px' }}
            onClick={() => handleRemoveFilter(val)}
            className="button-remove-task"
          />
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    return value?.map((val: any) => {
      switch (val) {
        case 'user':
          return renderInputRow('Nhập tên người tạo:', 'Nhập tên người tạo để tìm...', val);
        case 'status':
          return renderInputRow('Nhập trạng thái công việc:', 'Nhập tên công việc để tìm...', val);
        case 'description':
          return renderInputRow('Nhập nội dung mô tả:', 'Nhập nội dung mô tả để tìm...', val);
        case 'createdAt':
          return (
            <div style={{ marginBottom: '10px' }}>
              <Row key={val}>
                <Col span={4}>
                  <Select options={optionDay} defaultValue="all" />
                </Col>
                <Col span={8}>
                  <DatePicker />
                </Col>
                <Col span={2}>
                  <CloseOutlined
                    style={{ color: 'red', margin: '9px 0px' }}
                    onClick={() => handleRemoveFilter(val)}
                    className="button-remove-task"
                  />
                </Col>
              </Row>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return <div style={{ marginTop: 10 }}>{renderContent()}</div>;
};





export const getShortName = (name: string) => {
  if (!!!name) return "";
  const arrName = (name).trim()?.split(' ');
  if (!arrName.length) return "";
  return (arrName[arrName.length - 2]?.charAt(0) || "") + (arrName[arrName.length - 1]?.charAt(0) || "");
}
