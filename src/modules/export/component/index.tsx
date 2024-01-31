import React, { useState } from 'react';
import { Button, Dropdown, Menu, Space } from 'antd';
import { ApiFilled, DownloadOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { BASE_URL } from '~/constants/defaultValue';
import { forIn } from 'lodash';
import moment from 'moment';
import axios from 'axios';
// import './index.scss'
import { SizeType } from 'antd/es/config-provider/SizeContext';

interface Props {
    size?: SizeType;
    stylesButton?: any;
    query?: any;
    fileName?: string
};

const ExportExcelButton = ({ size, stylesButton, query,fileName }: Props) => {
  
  const defaultStyles = {
    position: 'absolute',
    top: '200px',
    right: "100px",
    width: '150px',
  } 
  const handleOnClick = async (obj: any) => {
    if (query || query?.fileName_ || query?.url || query?.exportOption) {
        const { fileName_ } = query;
    //   const query = {
    //     exportOption: query?.keyExport
    //   }
      const { searchBy } = query
      // let a = !searchBy ? `?exportByCase=${obj}&` : `&exportByCase=${obj}&`
      let a =  `?` 
      forIn({ ...query }, (value, key) => {
        a = a + key + '=' + value 
      })
      const dateNow = moment(Date.now()).format("DD-MM-YYYY HH:mm")
      const keyExportUrl = '/api/v1/export';
      const linkUrl = keyExportUrl.concat(query.url)
      // Handle value search when it exist
    //   if (searchBy) {
    //     let params = searchBy?.split('?');
    //     let newSearch = `&${params.join('&')}`;
    //     a = (a.concat(newSearch))
    //     a = a.replace('?&', '&') || a.replace('&&', '&') 
    //     };
    //   if (a.includes('&&')) {
    //     a = a.replace('&&', '&') 
    //   }
    //   if (a.includes('?&')) {
    //     a = a.replace('?&', '&') 
    //   }
      switch (obj) { 
        case '1':
        //   let setQuery = a.split("&")?.filter(string => !string?.includes("page=") && !string?.includes("limit="));
        //   a = setQuery.join("&")
          break;
        case '2':
        //   if (!query?.ids.length) {
        //     toastr.error('Không tồn tại lựa chọn nào!')
        //    a = ''
        //   } else {
        //     a = a.concat(`&ids=${query?.ids || ''}`)
        //   }
          break;
        case '3':
        //   let newA = ''
        //   const newKeyExport = a.split('&')[0].concat("Page&")
        //   searchBy ?  newA = searchBy.replace('?', '') : ()=>{}
        //   a = newKeyExport.concat(newA)
        //   a = a.includes("&&") ? a.replace("&&", "&") : a 
          break;
        default:
          break;
      }
      const temp = BASE_URL.concat(linkUrl, a);
     a !== '' ?   axios.get(temp, {
        method: 'GET',
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('target',"_blank");
        link.setAttribute('download', `${fileName_}_${dateNow}.xlsx`);
        document.body.appendChild(link);
        link.click();
    }) : ()=>{};
    } else {
      console.log('cannot export excel file')
    }
  }
  
  return (
    <Dropdown.Button
      dropdownRender={ () => <MenuButton handle={handleOnClick} /> }
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
export default ExportExcelButton;


function MenuButton({ handle}: any) {
  return (
    <Menu>
      <Menu.Item>
        <Button className='button-export__children'  type='primary' size='small' onClick={()=>handle("2")} >Theo lựa chọn</Button>
      </Menu.Item>
      <Menu.Item>
        <Button className='button-export__children' type='primary' size='small'  onClick={()=>handle( "3")}>Theo trang hiện tại</Button>
      </Menu.Item>
    </Menu>
  )
}