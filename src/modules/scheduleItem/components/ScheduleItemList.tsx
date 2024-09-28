import React from 'react';
import { ScheduleItemBase } from '../scheduleItem.modal';
import ScheduleItemAdd from './ScheduleItemAdd';
import {ReactComponent as PlayIcon} from '~/assets/icons/Play.svg';
import ClockIcon from '~/assets/icons/Clock.svg';
import { FileDoneOutlined } from '@ant-design/icons';
type propsType = {
  id : string;
  dataSource : ScheduleItemBase[]
}


export default function ScheduleItemList({id,dataSource}:propsType) : React.JSX.Element {

  
    return (
      <>
      {dataSource?.map((item) => <div className='course-item'>
            {item.contentType === 'video' ? <PlayIcon /> : <FileDoneOutlined />}
            <span className='course-item--title'>{item.name}</span>
            {/* {item.contentType === 'video' && <span className='course-item--time'><ClockIcon /> {item.time}</span>} */}
        </div>)}
      <ScheduleItemAdd scheduleId={id}/>
      </>

    )
}