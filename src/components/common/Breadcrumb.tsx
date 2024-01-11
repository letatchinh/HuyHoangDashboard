import { Breadcrumb as BreadcrumbAntd, Col, Row } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ title } : {title : string | React.JSX.Element}) => {
    const items : {title : any}[]= useMemo(() => [
        {
          title: <Link className="text-decoration-none" to={'/'}>Trang chủ</Link>,
        },
        {
          title : <Link className="text-decoration-none" to={'/'}>{title}</Link>,
        },
      ],[title])
  return (
      <div className='pb-4'>
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="mb-0">{title}</h4>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
                <BreadcrumbAntd 
                items={items}/>
            </ol>
          </div>
        </div>
      </div>
  );
};

export default Breadcrumb;
