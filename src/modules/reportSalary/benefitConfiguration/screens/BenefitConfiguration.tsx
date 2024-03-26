import { SettingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { keys } from "lodash";
import React, { useState } from "react";
import BtnActionSecondary from "~/modules/homepage/components/BtnActionSecondary";
import { TypeBenefit } from "../benefitConfiguration.modal";
import TableConfig from "../components/TableConfig";
import {
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL,
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI,
  TYPE_BENEFIT_VI,
} from "../constants";
import { BenefitConfigProvider } from "../store/BenefitConfigContext";
type propsType = {};
const CLONE_TYPE_BENEFIT_VI: any = TYPE_BENEFIT_VI;
const CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL: any =
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL;
const CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI: any =
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI;
export default function BenefitConfiguration(
  props: propsType
): React.JSX.Element {
  const [active, setActive] = useState<TypeBenefit>("BENEFIT_TDV");
  const onCreateBenefitTDV = (typeBenefit: TypeBenefit) => {
    setActive(typeBenefit);
  };
  return (
    <BenefitConfigProvider typeBenefit={active}>
      {keys(GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL).map((k: any) => (
        <div>
          <h5>{CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI[k]}</h5>
          <div className="benefitConfiguration">
            <Flex gap={10} className="benefitConfiguration--group" wrap="wrap">
              {CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL[k].map((key: any) => (
                <BtnActionSecondary
                  className={key === active ? "active" : ""}
                  value={CLONE_TYPE_BENEFIT_VI[key]}
                  onClick={() => onCreateBenefitTDV(key)}
                />
              ))}
            </Flex>
          </div>
        </div>
      ))}

      <TableConfig typeBenefit={active} />
    </BenefitConfigProvider>
  );
}
