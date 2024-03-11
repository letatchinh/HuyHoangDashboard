import { Button, Flex } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import WhiteBox from '~/components/common/WhiteBox';
import { useGetColumns, useGetDataSource } from '../benefitConfiguration.hook';
import { TypeBenefit } from '../benefitConfiguration.modal';
import { CreateConditionByType } from '../benefitConfiguration.service';
import { TYPE_BENEFIT_VI } from '../constants';
import useBenefitConfigStore from '../store/BenefitConfigContext';
import CreateConditionBenefitBase from './CreateConditionOverBtn';
import CreateConditionOverBtn from './CreateConditionOverBtn';
import CreateConditionWorking from './CreateConditionWorking';
import FormCondition from './FormCondition';
type propsType = {
    typeBenefit? : TypeBenefit | null
};
const CLONE_TYPE_BENEFIT_VI : any = TYPE_BENEFIT_VI;
export default function TableConfig({typeBenefit}:propsType) : React.JSX.Element {
  const {isLoading,mutate} = useBenefitConfigStore();
  const ref : any = useRef();
    // Condition
    const [openCondition,setOpenCondition] = useState(false);
    const onOpenCondition = useCallback(() => {
        setOpenCondition(true);
    },[]);
    const onCloseCondition = useCallback(() => {
        setOpenCondition(false);
    },[]);
    // List Supplier
    const [openRemoveSupplier,setOpenRemoveSupplier] = useState(false);
    const onOpenRemoveSupplier = useCallback(() => {
        setOpenRemoveSupplier(true);
    },[]);
    const onCloseRemoveSupplier = useCallback(() => {
        setOpenRemoveSupplier(false);
    },[]);

    const columns :any[]= useGetColumns();
    const dataSource : any[] = useGetDataSource();
    
    useEffect(() => {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    },[typeBenefit]);
    return (
    <div ref={ref}>
        <WhiteBox>
        <Flex gap={10}>
          <CreateConditionByType
            typeBenefit={typeBenefit}
            ComponentCreateConditionBenefitBase={<CreateConditionBenefitBase canCreate={!dataSource?.length}/>}
            ComponentCreateConditionBenefit={<Button
              className="mb-2"
              type="primary"
              shape="round"
              onClick={onOpenCondition}
            >
              Thêm điều kiện
            </Button>}
            ComponentCreateConditionKpis={<Button
              className="mb-2"
              type="primary"
              shape="round"
              onClick={onOpenCondition}
            >
              Thêm điều kiện
            </Button>}
            ComponentCreateConditionOver={<CreateConditionOverBtn canCreate={!dataSource?.length} />}
            ComponentCreateConditionWorking={!dataSource?.length ? <CreateConditionWorking /> : <></>}
          />
          <Button
            className="mb-2"
            danger
            shape="round"
            onClick={onOpenRemoveSupplier}
          >
            Gỡ nhà cung cấp
          </Button>
        </Flex>

        <TableAnt
          loading={isLoading}
          stickyTop
          title={() =>
            typeBenefit ? <h5>{CLONE_TYPE_BENEFIT_VI[typeBenefit]}</h5> : ""
          }
          size="small"
          pagination={false}
          bordered={true}
          // scroll={{ x: WIDTH_ITEM * (columns?.length + 1) }}
          columns={columns}
          dataSource={dataSource}
        />
        <ModalAnt
          title="Thêm điều kiện"
          destroyOnClose
          open={openCondition}
          onCancel={onCloseCondition}
          footer={false}
        >
          <FormCondition
            onCancel={onCloseCondition}
            mutate={mutate}
            typeBenefit={typeBenefit}
          />
        </ModalAnt>

        <ModalAnt
          title="Danh sách nhà cung cấp muốn gỡ"
          destroyOnClose
          open={openRemoveSupplier}
          onCancel={onCloseRemoveSupplier}
          footer={false}
        ></ModalAnt>
      </WhiteBox>
    </div>
    );
}