import React from 'react';
import ListExchange from './ListExchange';
type propsType = {
  id: any
};
export default function ExchangeRate(props:propsType) : React.JSX.Element {
  return (
    <div>
      <ListExchange/>
    </div>
  )
}