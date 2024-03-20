import { Button, Dropdown, Menu, Space } from 'antd';
import { BASE_URL } from '~/constants/defaultValue';
import moment from 'moment';
import axios from 'axios';
import {omit} from 'lodash'
import { SizeType } from 'antd/es/config-provider/SizeContext';
import useNotificationStore from '~/store/NotificationContext';

interface Props {
    size?: SizeType;
    stylesButton?: any;
    query?: any;
    fileName: string;
    api: string
    exportOption: string;
    ids?: string[];
};

const defaultStyles = {
  position: 'absolute',
  top: '200px',
  right: "100px",
  width: '150px',
};
export default function ExportExcelButton({ size, stylesButton, query, fileName, api, exportOption, ids }: Props) {
  const {onNotify} = useNotificationStore();
  const handleOnClick = async (obj: any) => {
    try {
      if (query || api) {
        const concatExportOption = {
          ...query,
          exportOption
        };
        const newQuery : any = Object.fromEntries(Object.entries(concatExportOption)?.filter(([_, v]) => v !== null && v !== undefined));
        let a = `?`
        const dateNow = moment(Date.now()).format("DD-MM-YYYY HH:mm")
        const keyExportUrl = 'api/v1/export';
        const linkUrl = keyExportUrl.concat(`/${api}`)
        switch (obj) {
          case '1':
            const newObj_1 : any = {
              ...omit(newQuery, ['page', 'limit']),
              exportOptionV2: 'ALL'
            };
            let queryString_1 = Object.keys(newObj_1).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newObj_1[key])}`).join('&');
            a = a.concat(queryString_1);
            break;
          case '2':
              if (!ids?.length) {
                onNotify?.error('Không tồn tại lựa chọn nào!')
                a = '';
              } else {
                const newObj_2 : any = {
                  ...omit(newQuery, ['page', 'limit']),
                  ids,
                  exportOptionV2 : 'OPTION' 
                };
                let queryString_2 = Object.keys(newObj_2).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newObj_2[key])}`)?.join('&');
                a = a.concat(queryString_2);
            };
            break;
          case '3':
            const newExportOption = exportOption.concat('Page');
            const newObj_3 = {
              ...newQuery,
              exportOption: newExportOption,
              exportOptionV2: "PAGING"
            };
            let queryString_3 = Object.keys(newObj_3).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newObj_3[key])}`).join('&');
            a = a.concat(queryString_3);
            break;
          default:
            break;
        };
        console.log(a)
        const temp = BASE_URL.concat(linkUrl, a);
        console.log(temp)
        try {
          if (a !== '') {
            console.log('vo day')
            axios.get(temp, {
              method: 'GET',
              responseType: 'blob',
            }).then((response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('target', "_blank");
              link.setAttribute('download', `${fileName}_${dateNow}.xlsx`);
              document.body.appendChild(link);
              link.click();
            })
          };
        } catch (error: any) {
          onNotify?.error(error || 'Có lỗi xảy ra!')
        };
      };
    } catch (error: any) {
      onNotify?.error(error || 'Có lỗi xảy ra!')
    };
  };
  return (
    <Dropdown.Button
      dropdownRender={ () => <MenuButton handle={handleOnClick} ids = {ids}/> }
      onClick = {()=>handleOnClick( "1" )}
      trigger={['hover']}
      style={{
        margin: '0px 10px '
      }}
      type="primary"
      size={size ? size : "middle"}
    >
      Tải về
      </Dropdown.Button>
  )
};
// export default ExportExcelButton;


function MenuButton({ handle, ids}: any) {
  return (
    <Menu>
      {ids && <Menu.Item>
        <Button className='button-export__children'  type='primary' size='small' onClick={()=>handle("2")} >Theo lựa chọn</Button>
      </Menu.Item>}
      <Menu.Item>
        <Button className='button-export__children' type='primary' size='small'  onClick={()=>handle( "3")}>Theo trang hiện tại</Button>
      </Menu.Item>
    </Menu>
  )
}