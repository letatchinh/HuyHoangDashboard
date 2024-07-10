import { Button, Flex, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import useCreateBillStore from '~/modules/sale/bill/storeContext/CreateBillContext';
import { CouponInSelect } from '../coupon.modal';
import Coupon from './Coupon';

type propsType = {

}
export default function SelectCoupon(props:propsType) : React.JSX.Element {
    const {coupons,onChangeCoupleSelect} = useCreateBillStore();
    const [selected,setSelected] = useState<CouponInSelect[]>([]);
    
    const couponFreeShipSingle = useMemo(() => coupons?.filter((coupon : CouponInSelect) => coupon?.applyFor === "SHIP" && !coupon?.multiple),[coupons]);
    const couponFreeShipMulti = useMemo(() => coupons?.filter((coupon : CouponInSelect) => coupon?.applyFor === "SHIP" && coupon?.multiple),[coupons]);
    const couponBillMulti = useMemo(() => coupons?.filter((coupon : CouponInSelect) => coupon?.applyFor === "BILL" && coupon?.multiple),[coupons]);
    const couponBillSingle = useMemo(() => coupons?.filter((coupon : CouponInSelect) => coupon?.applyFor === "BILL" && !coupon?.multiple),[coupons]);

    const onAdd = (newCoupon:CouponInSelect) => {
        
        const listDiffApplyFor = selected?.filter((item) => item?.applyFor !== newCoupon?.applyFor);
        const listSameApplyFor = [...selected?.filter((item) => item?.applyFor === newCoupon?.applyFor),newCoupon];
        if(newCoupon?.multiple){
            setSelected([...listDiffApplyFor,...listSameApplyFor?.filter((item) => item?.multiple === newCoupon?.multiple)]);
        }else{
            setSelected([...listDiffApplyFor,newCoupon]);
        }
    };
    const onRemove = (removeId:string) => {
        setSelected(selected?.filter((item:any) => item._id === removeId))
    };
    const onFinish = () => {
        const listApplyForBill = selected?.filter((item) => item?.applyFor === "BILL");
        const listApplyForShip = selected?.filter((item) => item?.applyFor === "SHIP");
        onChangeCoupleSelect('bill',listApplyForBill);
        onChangeCoupleSelect('ship',listApplyForShip);
    }
    return (
        <div>
            <Flex justify={'space-between'}>
            <div>
                <SectionListDiscount selected={selected} onRemove={onRemove} onAdd={onAdd} data={couponFreeShipSingle} title="Mã Miễn Phí Vận Chuyển không kết hợp"/>
                <SectionListDiscount selected={selected} onRemove={onRemove} onAdd={onAdd} data={couponFreeShipMulti} title="Mã Miễn Phí Vận Chuyển kết hợp"/>
            </div>
            <div>
                <SectionListDiscount selected={selected} onRemove={onRemove} onAdd={onAdd} data={couponBillSingle} title="Mã giảm giá đơn hàng không kết hợp"/>
                <SectionListDiscount selected={selected} onRemove={onRemove} onAdd={onAdd} data={couponBillMulti} title="Mã giảm giá đơn hàng kết hợp"/>
            </div>
        </Flex>
        <Flex style={{marginTop : 8}} justify={'end'}>
        <Button onClick={onFinish} type='primary'>
            Xác nhận
        </Button>
        </Flex>
        </div>
    )
}

const SectionListDiscount = ({
  data,
  title,
  onAdd,
  onRemove,
  selected,
}: {
  data: CouponInSelect[];
  title: string;
  onAdd : (p?:any) => void;
  onRemove : (p?:any) => void;
  selected : CouponInSelect[]
}) => {

  return (
    <div style={{ marginBottom: 8 }}>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 18, fontWeight: 500 }}
      >
        {title}
      </Typography.Text>
      {data?.map((item: CouponInSelect) => (
        <Coupon isChecked={selected?.some((sled) => sled?._id === item?._id)} onRemove={onRemove} onAdd={onAdd} key={item._id} coupon={item} />
      ))}
    </div>
  );
};