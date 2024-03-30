import React, { useEffect, useState } from 'react';
import FormListSupplier from './FormListSupplier';
import FormProduct from '~/modules/product/components/FormProduct';
import { Button, Row, Steps, theme } from 'antd';
import Search from 'antd/es/input/Search';
import { useSupplierInfoRedux } from '../productsAll.hook';
import { useResetActionProductFullState } from '~/modules/product/product.hook';
type propsType = {
  onChangeStep?: any;
  onCloseModal?: any;
  step?: any;
  setStep?: any;
};

export default function ShowStep({ onChangeStep, onCloseModal, step, setStep }: propsType): React.JSX.Element {
  const { token } = theme.useToken();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const supplierInfo = useSupplierInfoRedux();
  // useResetActionProductFullState();
  
  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const steps = [
    {
      title: 'Chọn nhà cung cấp',
      content: <FormListSupplier
        onChangeStep={onChangeStep}
        onCloseModal={onCloseModal}
        step={step}
        supplierId={supplierId}
        setSupplierId={setSupplierId}
        keyword={keyword}
      />,
    },
    {
      title: 'Tạo sản phẩm',
      content: <FormProduct
        onCancel={onCloseModal}
        supplierId={supplierId as any}
        setSupplierId={setSupplierId}
        setStep = {setStep}
      />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  useEffect(() => {
    setKeyword('');
  },[step])

  return (
    <div>
      <div>
        <Steps current={step} items={items} style={{width: '95%'}}/>
        {step === 0 && <Row>
          <Search
            style={{ width: 500, marginTop: '10px' }}
            placeholder="Tìm nhà cung cấp..."
            allowClear
            enterButton
            size="large"
            onSearch={(value) => setKeyword(value?.trim())}
          />
        </Row>}
        <div style={contentStyle}>{steps[step].content}</div>
      </div>
      <Row
        style={{ marginTop: 20}}
      >
      {supplierInfo && ( 
        step === 0 ? (
          <Button type="primary" onClick={() => onChangeStep(1)}>
          Tiếp theo
        </Button> 
        ) : (
          <Button type="primary"  style={{ margin: '0 8px' }} onClick={() => onChangeStep(0)}>
            Trở về
          </Button>
        )
        )}
    </Row>
    </div>
  );
};