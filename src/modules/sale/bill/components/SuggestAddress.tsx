import { Button, List } from "antd";
import React, { useEffect, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import { concatAddress } from "~/utils/helpers";
import useCreateBillStore from "../storeContext/CreateBillContext";
import PharmacyModule from "~/modules/pharmacy";
import { get } from "lodash";

type propsType = {
  onClose: () => void;
};
export default function SuggestAddress({
  onClose,
}: propsType): React.JSX.Element {
  const { address, setFormAndLocalStorage, form, setAddress } =
    useCreateBillStore();
  const [loading, setLoading] = useState(false);
  const onChange = (item: any) => {
    const addressString = concatAddress(item);
    setFormAndLocalStorage({
      deliveryAddress: addressString,
    });
    onClose();
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const pharmacies = await PharmacyModule.api.search({
          id: form.getFieldValue("pharmacyId"),
          optionWith: { id: [form.getFieldValue("pharmacyId")] },
        });
        const addressStories = get(pharmacies, "docs.[0].addressStories");
        setAddress(addressStories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    !address?.length && form.getFieldValue("pharmacyId") && fetchAddress();
  }, []);
  return (
    <BaseBorderBox title={"Sổ địa chỉ"}>
      <List
      loading={loading}
        style={{ maxHeight: 500, overflowY: "scroll" }}
        size="small"
        dataSource={address}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                onClick={() => onChange(item)}
                size="small"
                type="primary"
                ghost
              >
                Chọn
              </Button>,
            ]}
          >
            <List.Item.Meta title={<span>{concatAddress(item)}</span>} />
          </List.Item>
        )}
        itemLayout="horizontal"
      />
    </BaseBorderBox>
  );
}
