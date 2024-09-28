import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ title, linkTo,right }: { title: any, linkTo?: string,right? : any }) => {
    const items : {title : any}[]= useMemo(() => [
        {
          title: <Link className="text-decoration-none" to={'/'}>Trang chủ</Link>,
        },
        {
          title : <Link className="text-decoration-none" to={`${linkTo}` ?? '/'}>{title}</Link>,
        },
      ],[linkTo, title])
  return (
      <div className='pb-4'>
        <div className="d-flex align-items-center justify-content-between" style={{height:29}}>
          <h4 className="mb-0">{title}</h4>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
                {/* <BreadcrumbAntd 
                items={items}/> */}
                {right && right}
            </ol>
          </div>
        </div>
      </div>
  );
};

export default Breadcrumb;
