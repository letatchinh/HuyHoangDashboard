import { AutoComplete, Form, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useGetListMeddicineSearch } from '~/modules/medicine/medicine.hook';

let timeOut : any = null;
const FormItem = Form.Item;

const MedicineName = ({ form } : any) => {
  const [search, setSearch] = useState({});
  const [medicineOptions, isLoading] = useGetListMeddicineSearch(Object.keys(search).length === 0 ? null : search);

  const inputEl : any = useRef(null);

  useEffect(() => {
    return () => {
      timeOut = null;
    };
  }, []);

  const onSearch = (value:any) => {
    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      if (timeOut) {
        setSearch({keyword:value});
      }
    }, 500);
  };

  const handleSelect = (value:any) => {
    inputEl.current.blur();
    
    form.setFieldsValue({
      medicalCode:value.code,
      name: value.name,
      productDetail: {
        element: value.element,
        package: value.package,
      }
    });

    // const nextUnitValue = unitOptions.find(({ name }:any) => name === value.unit);

    // if (nextUnitValue) {
    //   form.setFieldsValue({
    //     defaultVariant: {
    //       unitId: nextUnitValue._id
    //     }
    //   });
    // }
  };

  return (
    <div>
      <FormItem
        label="Tên thuốc"
        name="name"
        rules={[
          { required: true, message: 'Xin mời nhập tên thuốc' },
          { max: 100, message: 'Tối đa 100 ký tự' }
        ]}
      >
        <AutoComplete
          style={{ width: '100%' }}
          onSearch={onSearch}
          onFocus={(e : any) => {
            if(Object.keys(search).length === 0){
              onSearch(e.target.value);
            }
          }}
          onSelect={handleSelect}
          options={medicineOptions || []}
          ref={inputEl}
          popupMatchSelectWidth={900}
          notFoundContent={<div></div>}
          getPopupContainer={() =>
            document.getElementById('medicine-autocomple-container') as any
          }
          dropdownRender={() => {
            return (
              <Table
                scroll={{ y: 450 }}
                className="autocomple-table"
                size="small"
                loading={isLoading}
                dataSource={medicineOptions}
                pagination={false}
                rowKey={rc => rc._id}
                columns={[
                  {
                    title: 'Tên thuốc',
                    dataIndex: 'name',
                    key: 'name'
                  },
                  {
                    title: 'Số đăng ký',
                    dataIndex: 'registrationNo',
                    key: 'registrationNo'
                  },
                  {
                    title: 'Hoạt chất',
                    dataIndex: 'element',
                    key: 'element'
                  },
                  {
                    title: 'Hàm lượng',
                    dataIndex: 'content',
                    key: 'content'
                  },
                  {
                    title: 'Quy cách đóng gói',
                    dataIndex: 'package',
                    key: 'package'
                  },
                  {
                    title: 'Hãng sản xuất',
                    dataIndex: 'manufacturer',
                    key: 'manufacturer'
                  }
                ]}
                onRow={record => {
                  return {
                    onClick: () => {
                      handleSelect(record);
                    }
                  };
                }}
              />
            );
          }}
        ></AutoComplete>
      </FormItem>
    </div>
  );
};

export default MedicineName;
