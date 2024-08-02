import { Alert, Button, Flex, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import useCreateBillStore from '~/modules/sale/bill/storeContext/CreateBillContext';
import { CouponInSelect } from '../coupon.modal';
import Coupon from './Coupon';
import { LoadingOutlined } from '@ant-design/icons';
import { get } from 'lodash';

type propsType = {

}
export default function SelectCoupon(props:propsType) : React.JSX.Element {
    const {coupons,onChangeCoupleSelect,loadingGetCoupon,couponSelected,onCloseCoupon} = useCreateBillStore();
    
    const [selected,setSelected] = useState<CouponInSelect[]>([]);
    
    const couponByType = useMemo(() => coupons?.reduce((sum : {
      couponFreeShipSingle : CouponInSelect[],
      couponFreeShipMulti : CouponInSelect[],
      couponBillMulti : CouponInSelect[],
      couponBillSingle : CouponInSelect[]
    },cur : CouponInSelect) => {
        if(cur?.applyFor === "SHIP" && !cur?.multiple){
            sum.couponFreeShipSingle.push(cur);
        }
        if(cur?.applyFor === "SHIP" && cur?.multiple){
            sum.couponFreeShipMulti.push(cur);
        }
        if(cur?.applyFor === "BILL" && cur?.multiple){
            sum.couponBillMulti.push(cur);
        }
        if(cur?.applyFor === "BILL" && !cur?.multiple){
            sum.couponBillSingle.push(cur);
        }
        return sum;
    },{
      couponFreeShipSingle : [],
      couponFreeShipMulti : [],
      couponBillMulti : [],
      couponBillSingle : []
    }),[coupons]);

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
        setSelected(selected?.filter((item:any) => item._id !== removeId))
    };
    const onFinish = () => {
        const listApplyForBill = selected?.filter((item) => item?.applyFor === "BILL");
        const listApplyForShip = selected?.filter((item) => item?.applyFor === "SHIP");
        onChangeCoupleSelect({
          bill : listApplyForBill,
          ship : listApplyForShip
        });
        onCloseCoupon();
    };

    useEffect(() => {
      setSelected([...get(couponSelected,'bill',[]),...get(couponSelected,'ship',[])]);
    },[couponSelected]);

    const PropsSection = {
      selected,
      onRemove,
      onAdd,
    };

    return (
        <div>
            <Alert message={<span>Bạn đã chọn {<Typography.Text type='success' strong>{selected?.length}</Typography.Text>} mã giảm giá</span>} type="success" showIcon />
            <Flex justify={'space-between'}>
              {loadingGetCoupon ? <LoadingOutlined /> : <>
                <div>
                <SectionListDiscount {...PropsSection} data={couponByType.couponFreeShipSingle} title="Mã Miễn Phí Vận Chuyển không kết hợp"/>
                <SectionListDiscount {...PropsSection} data={couponByType.couponFreeShipMulti} title="Mã Miễn Phí Vận Chuyển kết hợp"/>
            </div>
            <div>
                <SectionListDiscount {...PropsSection} data={couponByType.couponBillSingle} title="Mã giảm giá đơn hàng không kết hợp"/>
                <SectionListDiscount {...PropsSection} data={couponByType.couponBillMulti} title="Mã giảm giá đơn hàng kết hợp"/>
            </div>
            </>}
            
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
        <Coupon target='BILL' isChecked={selected?.some((sled) => sled?._id === item?._id)} onRemove={onRemove} onAdd={onAdd} key={item._id} coupon={item} />
      ))}
    </div>
  );
};