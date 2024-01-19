import { Form, Select } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import PharmacyModule from "~/modules/pharmacy";
import { FormFieldCreateBill } from "../bill.modal";

type propsType = {};
export default function SelectPharmacy(props: propsType): React.JSX.Element {
  const [pharmacies, isLoading] = PharmacyModule.hook.useGetPharmacies();

  const options = useMemo(
    () =>
      pharmacies?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      })),
    [pharmacies]
  );

  return (
    <Form.Item<FormFieldCreateBill>
      name={"pharmacyId"}
      rules={[
        {
          required: true,
          message: "Vui lòng chọn nhà thuốc",
        },
      ]}
    >
      <Select
        options={options}
        loading={isLoading}
        placeholder="Chọn nhà thuốc..."
        size="large"
      />
    </Form.Item>
  );
}
