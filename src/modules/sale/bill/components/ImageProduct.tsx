import { compact, get } from 'lodash';
import React, { useMemo } from 'react';
import imageDefault from '~/assets/images/image.jpeg';

type propsType = {
    images : string[]
}
export default function ImageProduct({images}:propsType) : React.JSX.Element {
    const image = useMemo(() => get(compact(images),'[0]'),[images]);

    return (
        <div >
        <img src={image ?? imageDefault} alt='Ảnh mặt hàng'/>
      </div>
    )
}