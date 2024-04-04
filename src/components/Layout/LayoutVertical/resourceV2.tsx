// import { AppstoreFilled, AppstoreOutlined, ShopFilled,ApartmentOutlined } from "@ant-design/icons";
import {
  AppstoreFilled,
  DatabaseOutlined,
  DollarOutlined,
  HddOutlined,
  HomeOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  BellFilled,
  FundProjectionScreenOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import React, { useCallback, useMemo } from "react";
import { PATH_APP } from "~/routes/allPath";
import POLICIES, { GROUP_POLICY } from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
type MenuItem = Required<MenuProps>["items"][number];

type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
  permission?: any;
};
const permissionOfSetup = [
  POLICIES.READ_PRODUCTGROUP,
  POLICIES.READ_MANUFACTURER,
  POLICIES.READ_RANKING,
  POLICIES.READ_UNIT,
  POLICIES.READ_MEDICINE,
  POLICIES.READ_CONFIGDISCOUNT,
  POLICIES.READ_AREACONFIGURATION,
  POLICIES.READ_CONFIGBASESALARY,
  POLICIES.READ_CONFIGBENEFIT,
  POLICIES.READ_SALESGROUP,
  POLICIES.READ_CONFIGCRONTIME

];
const permissionPharma = [
  POLICIES.READ_PHARMAPROFILE,
  POLICIES.READ_BILL,
  POLICIES.READ_QUOTATION,
  POLICIES.WRITE_QUOTATION,
  POLICIES.READ_CUMULATIVEEVENT,
  POLICIES.READ_VOUCHERPHARMACY,

];

const permissionSupplier = [
  POLICIES.READ_SUPPLIER,
  POLICIES.READ_VOUCHERSUPPLIER,
  POLICIES.READ_CUMULATIVESALESSUPPLIER,
  
];

const permissionEmployee = [
  POLICIES.READ_EMPLOYEE,
  POLICIES.READ_EMPLOYEEGROUP,
  POLICIES.READ_EMPLOYEEPOSITION
];

export const resource: ItemType[] =[ 
  {
    label: "WorldPharmaVN",
    key: "WorldPharmaVN",
    icon: <i className="fa-solid fa-earth-americas"></i>,
    permission: [POLICIES.READ_PRODUCT, ...permissionOfSetup], 
    children: [
      {
        label: "Danh sách sản phẩm",
        path: PATH_APP.productAll.root,
        key: PATH_APP.productAll.root,
        icon: <i className="fa-solid fa-capsules"></i>,
        permission: [POLICIES.READ_PRODUCT],//
      },
      {
        label: "Cài đặt",
        key: "WorldPharmaVN-setting",
        icon: <i className="fa-solid fa-gear"></i>,
        permission: [...permissionOfSetup],
        children: [
          {
            label: "Nhóm sản phẩm",
            path: PATH_APP.worldPharma.productGroup,
            key: PATH_APP.worldPharma.productGroup,
            icon: <HddOutlined />,
            permission: [POLICIES.READ_PRODUCTGROUP],//
          },
          {
            label: "Danh sách hãng sản xuất",
            path: PATH_APP.worldPharma.manufacturer,
            key: PATH_APP.worldPharma.manufacturer,
            icon: <HomeOutlined />,
            permission: [POLICIES.READ_MANUFACTURER],//
          },
          {
            label: "Xếp hạng nhà cung cấp",
            path: PATH_APP.worldPharma.ranking,
            key: PATH_APP.worldPharma.ranking,
            icon: <TrophyOutlined />,
            permission: [POLICIES.READ_RANKING],//
          },
          {
            label: "Đơn vị tính",
            path: PATH_APP.worldPharma.unit,
            key: PATH_APP.worldPharma.unit,
            icon: <DollarOutlined />,
            permission: [POLICIES.READ_UNIT],//
          },
          {
            label: "Danh sách thuốc",
            path: PATH_APP.worldPharma.medicine,
            key: PATH_APP.worldPharma.medicine,
            icon: <DatabaseOutlined />,
            permission: [POLICIES.READ_MEDICINE],//
          },
          {
            label: "Cấu hình giảm giá",
            path: PATH_APP.configDiscount.root,
            key: PATH_APP.configDiscount.root,
            permission: [POLICIES.READ_CONFIGDISCOUNT],//
            icon: <i className="fa-solid fa-percent"></i>,
          },
          {
            label: "Thông báo tự động",
            icon: <BellFilled />,
            path: PATH_APP.botNotification.root,
            key: PATH_APP.botNotification.root,
            permission: [POLICIES.READ_NOTIFICATIONBOTMANAGER], //
          },
          {
            label: "Nhóm bán hàng",
            icon: <i className="fa-solid fa-chart-area"></i>,
            path: PATH_APP.salesGroup.root,
            key: PATH_APP.salesGroup.root,
            permission: [POLICIES.READ_SALESGROUP], //
          },
          {
            label: "Cấu hình lương vùng",
            icon: <i className="fa-solid fa-money-bill-trend-up"></i>,
            path: PATH_APP.baseSalary.root,
            key: PATH_APP.baseSalary.root,
            permission: [POLICIES.READ_CONFIGBASESALARY], //
          },
          {
            label: "Cấu hình hoa hồng",
            icon: <i className="fa-brands fa-pagelines"></i>,
            path: PATH_APP.benefitConfiguration.root,
            key: PATH_APP.benefitConfiguration.root,
            permission: [POLICIES.READ_CONFIGBENEFIT], //
          },
          {
            label: "Kênh bán hàng",
            icon: <i className="fa-solid fa-cart-shopping"></i>,
            path: PATH_APP.saleChannel.root,
            key: PATH_APP.saleChannel.root,
            permission: [POLICIES.READ_SALESCHANNEL],
          },
          {
            label: "Cấu hình thời gian tự động",
            path: PATH_APP.configurationCronTime.root,
            key: PATH_APP.configurationCronTime.root,
            icon: <FieldTimeOutlined />,
            permission: [POLICIES.READ_CONFIGCRONTIME],
          },
          {
            label: "Loại nhà thuốc",
            path: PATH_APP.typePharmacy.root,
            key: PATH_APP.typePharmacy.root,
            icon: <i className="fa-solid fa-truck-medical"></i>,
            permission: [POLICIES.READ_CUSTOMERGROUP],
          },
          {
            label: "Nhóm nhà thuốc",
            path: PATH_APP.groupPharmacy.root,
            key: PATH_APP.groupPharmacy.root,
            icon: <i className="fa-solid fa-notes-medical"></i>,
            permission: [POLICIES.READ_CUSTOMER],
          },
        ],
      },
    ],
  },

  // Nhà cung cấp//
  {
    label: "Nhà cung cấp",
    icon: <i className="fa-solid fa-cubes"></i>,
    key: "supplier",
    permission: [...permissionSupplier],//
    children: [
      {
        label: "Danh sách nhà cung cấp",
        path: PATH_APP.supplier.root,
        key: PATH_APP.supplier.root,
        permission: [POLICIES.READ_SUPPLIER],//
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.orderSupplier.root,
        key: PATH_APP.orderSupplier.root,
        permission: [POLICIES.READ_ORDERSUPPLIER],//
      },
      {
        label: "Doanh số tích luỹ",
        path: PATH_APP.report.supplier,
        key: PATH_APP.report.supplier,
        permission: [POLICIES.READ_CUMULATIVESALESSUPPLIER],//
      },

      {
        label: "Phiếu",
        // icon: <MoneyCollectOutlined />,
        path: PATH_APP.vouchers.supplier,
        key: PATH_APP.vouchers.supplier,
        permission: [POLICIES.READ_VOUCHERSUPPLIER],//
      },
    ],
  },

  // Nhà thuốc
  {
    label: "Nhà thuốc",
    icon: <i className="fa-solid fa-house-chimney-medical"></i>,
    key: "pharmacy",
    permission: [...permissionPharma],//
    children: [
      {
        label: "Danh sách nhà thuốc",
        path: PATH_APP.pharmacy.root,
        key: PATH_APP.pharmacy.root,
        permission: [POLICIES.READ_PHARMAPROFILE],//
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.bill.root,
        key: PATH_APP.bill.root,
        permission: [POLICIES.READ_BILL],//
      },
      {
        label: "Đơn hàng tạm",
        path: PATH_APP.quotation.root,
        key: PATH_APP.quotation.root,
        permission: [POLICIES.READ_QUOTATION],//
      },
      {
        label: "Tạo đơn hàng tạm",
        path: PATH_APP.bill.create,
        key: PATH_APP.bill.create,
        permission: [POLICIES.WRITE_QUOTATION],//
      },
      {
        label: "Luỹ kế mặt hàng",
        path: PATH_APP.bill.lk,
        key: PATH_APP.bill.lk,
        permission: [POLICIES.READ_CUMULATIVEEVENT],//
      },
      {
        label: "Phiếu",
        // icon: <MoneyCollectOutlined />,
        path: PATH_APP.vouchers.pharmacy,
        key: PATH_APP.vouchers.pharmacy,
        permission: [POLICIES.READ_VOUCHERPHARMACY],//
      },
      {
        label: "Hợp đồng khoán",
        path: PATH_APP.freelanceContractPharmacy.root,
        key: PATH_APP.freelanceContractPharmacy.root,
        permission: [POLICIES.READ_CONTRACTPHARMACY],//
      },
    ],
  },

  // Chi nhánh
  {
    label: "Chi nhánh",
    key: "branch",
    permission: [POLICIES.READ_BRANCH],//
    children: [
      {
        label: "Danh sách chi nhánh",
        path: PATH_APP.branch.root,
        key: PATH_APP.branch.root,
        permission: [POLICIES.READ_BRANCH],//
      },
    ],
    icon: <i className="fa-solid fa-code-branch"></i>,
  },
  // Báo cáo
  {
    label: "Báo cáo",
    key: "report",
    permission: [POLICIES.READ_REPORTSALARY],
    children: [
      {
        label: "Báo cáo lương trình dược viên",
        path: PATH_APP.report.employee,
        key: PATH_APP.report.employee,
        permission : [POLICIES.READ_REPORTSALARY]
      },
    ],
    icon: <i className="fa-solid fa-code-branch"></i>,
  },

  {
    label: "Quản lý công việc",
    key: "todoList",
    icon: <i className="fa-solid fa-clipboard-list"></i>,
    permission: [POLICIES.READ_TODOLIST, POLICIES.READ_TODOCONFIGSTATUS],//
    children: [
      {
        label: "Quản lý công việc",
        // key: "statusConfig",
        icon: <ApartmentOutlined />,
        path: PATH_APP.todoList.workBoard,
        key: PATH_APP.todoList.workBoard,
        permission: [POLICIES.READ_TODOLIST],//
      },
      {
        label: "Cấu hình trạng thái",
        // key: "statusConfig",
        icon: <AppstoreFilled />,
        path: PATH_APP.todoList.statusConfig,
        key: PATH_APP.todoList.statusConfig,
        permission: [POLICIES.READ_TODOCONFIGSTATUS],//
      },
    ],
  },

  //Nhân viên
  {
    label: "Trình dược viên",
    icon: <i className="fa-solid fa-users"></i>,
    path: PATH_APP.employee.root,
    key: PATH_APP.employee.root,
    permission: [...permissionEmployee],//
  },
  //Người dùng
  {
    label: "Người dùng",
    icon: <i className="fa-solid fa-user"></i>,
    path: PATH_APP.user.root,
    key: PATH_APP.user.root,
    permission: [POLICIES.READ_USER, POLICIES.READ_USERGROUP],//
  },
  {
    label: "Quản lý chi phí",
    icon: <FundProjectionScreenOutlined />,
    path: PATH_APP.costManagement.root,
    key: PATH_APP.costManagement.root,
    permission: [POLICIES.READ_SHIPPINGCOST],//
  },
];

// //Required permission is string[][];
// const NavbarItems = resource.map((first) => {
//   if (first.children?.length) {
//     const newChildFirst = first.children.map((second) => {
//       if (second.children?.length) {
//         const newChildSecond = second.children.map((third) => getItem(third));
//         return getItem({ ...second, children: newChildSecond });
//       } else {
//         return getItem(second);
//       }
//     });
//     return getItem({ ...first, children: newChildFirst });
//   } else {
//     return getItem(first);
//   }
// });
// export default NavbarItems;
