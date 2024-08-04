import React from 'react';
import { InventoryWarehouseProvider } from '../../store/InventoryStore';
import InventoryScreen from './Inventory';
type propsType = {

}
export default function Inventory(props:propsType) : React.JSX.Element {
  return (
      <InventoryWarehouseProvider>
          <InventoryScreen/>
      </InventoryWarehouseProvider>
  )
}