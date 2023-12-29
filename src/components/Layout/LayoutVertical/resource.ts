import { AppstoreFilled } from "@ant-design/icons";
import { PATH_APP } from "~/routes/allPath";

type ItemType = {
  label: string;
  icon?: any;
  children?: ItemType[];
  path?: string;
  key: string;
};

const NavbarItems: ItemType[] = [
  {
    label: "WorldPharmaVN",
    key: "WorldPharmaVN",
    icon: AppstoreFilled,
    children: [
      {
        label: "Cài đặt",
        key: "WorldPharmaVN-setting",
        icon:AppstoreFilled,
        children: [
          {
            label: "Cấu hình danh mục",
            path: PATH_APP.worldPharma.productConfig,
            key: PATH_APP.worldPharma.productConfig,
          },
        ],
      },
    ],
  },
];

export default NavbarItems;
