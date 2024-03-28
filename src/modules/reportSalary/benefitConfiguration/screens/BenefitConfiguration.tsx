import { SettingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { keys, omit } from "lodash";
import React, { useMemo, useState } from "react";
import BtnActionSecondary from "~/modules/homepage/components/BtnActionSecondary";
import { TypeBenefit } from "../benefitConfiguration.modal";
import TableConfig from "../components/TableConfig";
import {
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL,
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI,
  TYPE_BENEFIT_VI,
} from "../constants";
import { BenefitConfigProvider } from "../store/BenefitConfigContext";
import { useGetProfile } from "~/modules/auth/auth.hook";
import { EMPLOYEE_LEVEL } from "~/modules/employee/constants";
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
  const {profile, user} = useGetProfile();
  const filterGroupType: any = useMemo(() => {
    if (user?.isSuperAdmin) {
      return GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL
    } else {
      if (profile.employeeLevel === EMPLOYEE_LEVEL.ASM) {
        return GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL
      } else if (profile.employeeLevel === EMPLOYEE_LEVEL.TEAMLEADER) {
        return omit(GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL, 'ASM');
      } else if (profile.employeeLevel === EMPLOYEE_LEVEL.TDV) {
        return omit(GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL, [EMPLOYEE_LEVEL.ASM, EMPLOYEE_LEVEL.TEAMLEADER], EMPLOYEE_LEVEL.CTV);
      } else if (profile.employeeLevel === EMPLOYEE_LEVEL.CTV) {
        return omit(GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL, [EMPLOYEE_LEVEL.ASM, EMPLOYEE_LEVEL.TEAMLEADER, EMPLOYEE_LEVEL.TDV]);
      };
    };
  } , [GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL]);

  return (
    <BenefitConfigProvider typeBenefit={active}>
      {keys(filterGroupType).map((k: any) => (
        <div>
          <h5>{CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI[k]}</h5>
          <div className="benefitConfiguration">
            <Flex gap={10} className="benefitConfiguration--group" wrap="wrap">
              {filterGroupType[k].map((key: any) => (
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
