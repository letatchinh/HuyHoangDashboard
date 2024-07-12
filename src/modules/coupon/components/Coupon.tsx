import { Checkbox, Typography } from "antd";
import { get, range } from "lodash";
import React, { useCallback } from "react";
import freeProduct from "~/assets/images/coupon/freeProduct.png";
import freeShip from "~/assets/images/coupon/freeShip.png";
import useCreateBillStore from "~/modules/sale/bill/storeContext/CreateBillContext";
import { formatter, getTextOfDiscount } from "~/utils/helpers";
import { defaultConditions } from "../constants";
import { CouponInSelect } from "../coupon.modal";
import ShowDate from "./ShowDate";
type propsType = {
  coupon: CouponInSelect;
  onAdd : (p?:any) => void;
  onRemove : (p?:any) => void;
  isChecked : boolean;
  target : "BILL" | "BILL_ITEM",
};
export default function Coupon({ coupon,onAdd,onRemove,isChecked,target }: propsType): React.JSX.Element {
    const {queryBillItem} = useCreateBillStore();
  const { applyFor, discount, startDate, endDate, conditionsTrue,name } = coupon;
  const onActionAdd = () => {
    if(target === "BILL"){
      onAdd(coupon);
    }else{
      onAdd({...coupon,couponAtVariantId : queryBillItem?.variantId})
    }
  }
  
  return (
    <div className="coupon">
      <div className="coupon--left">
        <div className="coupon--left__dashed">
          {range(0, 9).map((value) => (
            <div className="coupon--left__dashed__item" />
          ))}
        </div>
        <div className="coupon--left__icon">
          <img src={applyFor === "BILL" ? freeProduct : freeShip} />
        </div>
      </div>
      <div className="coupon--middle">
        <Typography.Text type="secondary">
            {name}
        </Typography.Text>
        <span className="coupon--middle__discountValue">
          Giảm {getTextOfDiscount(discount?.value, discount?.type)} {discount?.maxDiscount ? `Giảm tối đa ${formatter(discount?.maxDiscount || 0)}` : ""}
        </span>
        <span className="coupon--middle__condition">
            {conditionsTrue?.map((item) => `${defaultConditions[item.key].vi} ${formatter(get(item,['value',item.key,'value'],''))}, `)}
        </span>
        
        <ShowDate endDate={endDate} startDate={startDate} />
      </div>
      <div className="coupon--right">
        <Checkbox checked={isChecked} onChange={(e) => e.target.checked ? onActionAdd() : onRemove(coupon?._id)}/>
      </div>
    </div>
  );
}
