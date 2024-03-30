import React from 'react';
import { Avatar, Image, List } from 'antd';
import { EMPLOYEE_LEVEL_VI } from '~/modules/employee/constants';
import AvatarShortOrName from '~/components/common/AvatarShortOrName';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

interface propsType { 
member?: any
};

const ListMemberModal = ({ member }: propsType) => {
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI;
  return (<List
    itemLayout="horizontal"
    dataSource={member}
    renderItem={(item: any, index: number) => (
      <List.Item>
        <List.Item.Meta
          avatar={
            item?.employee?.avatar ? 
            <Image
                alt="avatar"
                style={{ width: '60px', height: '60px' }}
              src={item?.employee?.avatar}
              preview={{
                imageRender: () => (
                  <img
                    src={item?.employee?.avatar}
                    style={{ width: '400px', height: '400px' }}
                    />
                    ),
                toolbarRender: () => null,
              }}
              />
              : <Image
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEWhoaFpDRRbAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC'
                preview={false}
                style={{ width: '60px', height: '60px' }}
              />
          }
          title={<h6>{item?.employee?.fullName}</h6>}
          description={<p>{CLONE_EMPLOYEE_LEVEL_VI[item?.employee?.employeeLevel]}</p>}
        />
      </List.Item>
    )}
  />)
};

export default ListMemberModal;