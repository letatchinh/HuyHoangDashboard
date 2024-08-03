import { Alert, Button, Flex, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import useCreateBillStore from '~/modules/sale/bill/storeContext/CreateBillContext';
import { CouponInSelect } from '../coupon.modal';
import Coupon from './Coupon';
import { LoadingOutlined } from '@ant-design/icons';
import { get, uniqBy } from 'lodash';

type propsType = {

}
export default function SelectCouponBillItem(props:propsType) : React.JSX.Element {
    const {couponsBillItem,onChangeCoupleSelect,loadingCouponBillItem,couponSelected,onCloseCouponBillItem,queryBillItem} = useCreateBillStore();
    
    const [selected,setSelected] = useState<CouponInSelect[]>([]);
    
    const couponByType = useMemo(() => couponsBillItem?.reduce((sum : {
      couponMulti : CouponInSelect[],
      couponSingle : CouponInSelect[]
    },cur : CouponInSelect) => {
        if(cur?.multiple){
            sum.couponMulti.push(cur);
        }
        if(!cur?.multiple){
            sum.couponSingle.push(cur);
        }
        return sum;
    },{
        couponMulti : [],
        couponSingle : []
    }),[couponsBillItem]);

    const onAdd = (newCoupon:CouponInSelect) => {
        if(newCoupon?.multiple){
          setSelected([...selected,{...newCoupon,couponAtVariantId : queryBillItem.variantId}]?.filter((item) => item?.multiple === newCoupon?.multiple));
        }else{
          setSelected([{...newCoupon,couponAtVariantId : queryBillItem.variantId}]);
        }
    };
    
    const onRemove = (removeId:string) => {
        setSelected(selected?.filter((item:any) => item._id !== removeId))
    };

    const onFinish = () => {
      const removeOldSelectedInThisSection = get(couponSelected,'item',[])?.filter((item) => item?.couponAtVariantId !== queryBillItem?.variantId)
        onChangeCoupleSelect({
          item : [...removeOldSelectedInThisSection,...selected]
        });
        onCloseCouponBillItem();
    };
    
    useEffect(() => {
      setSelected([...get(couponSelected,'item',[])]?.filter((item) => item.couponAtVariantId === queryBillItem?.variantId));
    },[couponSelected]);

    const PropsSection = {
      selected,
      onRemove,
      onAdd,
    };

    
    return (
        <div>
            <Alert message={<span>Bạn đã chọn {<Typography.Text type='success' strong>{selected?.length}</Typography.Text>} mã giảm giá</span>} type="success" showIcon />
            <Flex gap={10}>
              {loadingCouponBillItem ? <LoadingOutlined /> : <>
                <SectionListDiscount {...PropsSection} data={couponByType.couponSingle} title="Mã không kết hợp"/>
                <SectionListDiscount {...PropsSection} data={couponByType.couponMulti} title="Mã kết hợp"/>
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
    <div style={{ marginBottom: 8 , flex : 1 }}>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 18, fontWeight: 500 }}
      >
        {title}
      </Typography.Text>
      {data?.map((item: CouponInSelect) => (
        <Coupon target='BILL_ITEM' isChecked={selected?.some((sled) => sled?._id === item?._id)} onRemove={onRemove} onAdd={onAdd} key={item._id} coupon={item} />
      ))}
    </div>
  );
};