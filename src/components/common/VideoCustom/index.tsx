import React from 'react';
import { BASE_URL } from '~/constants/defaultValue';
type propsType = {
    src : any
}
export default function VideoCustom({src}:propsType) : React.JSX.Element {
  
    return (
        <div style={{height : '100%'}}>
            <video height="100%" autoPlay width="100%" controls >
              <source src={`${BASE_URL}api/image?pathFile=${src}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
    )
}