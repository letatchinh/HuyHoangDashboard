
import React from 'react';
import Breadcrumb from '~/components/common/Breadcrumb';
import useTranslate from '~/lib/translation';
type propsType = {

}
export default function CostManagement(props:propsType) : React.JSX.Element {
    const { t }: any = useTranslate();
    return (
        <div className="page-wrapper page-costManagement">
            <Breadcrumb title={t('Quản lý danh mục nhóm sản phẩm')} />
        </div>
    )
}