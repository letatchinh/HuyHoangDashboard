import {
  AppstoreFilled,
  DatabaseOutlined,
  DollarOutlined,
  HddOutlined,
  HomeOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  BellFilled,
  FieldTimeOutlined,
} from "@ant-design/icons";
import React from "react";
import { PATH_APP } from "~/routes/allPath";
import POLICIES from "~/modules/policy/policy.auth";

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
  // POLICIES.READ_AREACONFIGURATION,
  POLICIES.READ_CONFIGBASESALARY,
  POLICIES.READ_CONFIGBENEFIT,
  POLICIES.READ_SALESGROUP,
  POLICIES.READ_CONFIGCRONTIME,
  POLICIES.READ_USER,
  POLICIES.READ_USERGROUP,
  POLICIES.READ_BRANCH,
  POLICIES.READ_CONFIGREPORTSALARYAUTO,
];
const permissionPharma = [
  POLICIES.READ_PHARMAPROFILE,
  POLICIES.READ_CUMULATIVEEVENT,
  POLICIES.READ_VOUCHERPHARMACY,
  POLICIES.READ_BILLPHARMACY,
  POLICIES.READ_QUOTATIONPHARMACY,
];

const permissionBill = [
  POLICIES.READ_BILL,
  POLICIES.READ_QUOTATION,
  POLICIES.WRITE_QUOTATION,
];

const permissionSupplier = [
  POLICIES.READ_SUPPLIER,
  POLICIES.READ_VOUCHERSUPPLIER,
  POLICIES.READ_CUMULATIVESALESSUPPLIER,
  POLICIES.READ_ORDERSUPPLIER,
];

const permissionEmployee = [
  POLICIES.READ_EMPLOYEE,
  POLICIES.READ_EMPLOYEEGROUP,
  POLICIES.READ_EMPLOYEEPOSITION,
  POLICIES.READ_BILLEMPLOYEE,
  POLICIES.READ_QUOTATIONEMPLOYEE,
];

const permissionCollaborator = [
  POLICIES.READ_PARTNER,
  POLICIES.READ_PARTNERGROUP,
  POLICIES.READ_BILLPARTNER,
  POLICIES.READ_QUOTATIONPARTNER,
  POLICIES.WRITE_QUOTATIONPARTNER,
  POLICIES.READ_VOUCHERBILLPARTNER,
  POLICIES.READ_BORROWPRODUCT,
  POLICIES.READ_STATUSBORROWPRODUCT,
];

const permissionReport = [
  POLICIES.READ_REPORTOVERVIEW,
  POLICIES.READ_REPORTSALARY,
  POLICIES.READ_REPORTSALARYPARTNER,
  POLICIES.READ_REPORTOVERVIEWB2B,
  POLICIES.READ_REPORTOVERVIEWB2C,
  POLICIES.READ_REPORTREVENUEPERSONALEMPLOYEE,
  POLICIES.READ_REPORTREVENUEPERSONALPARTNER,
  POLICIES.READ_REPORTREVENUETEAMEMPLOYEE,
  POLICIES.READ_REPORTREVENUETEAMPARTNER,
];

export const resource: ItemType[] = [
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
        // icon: <i className="fa-solid fa-capsules"></i>,
        permission: [POLICIES.READ_PRODUCT], //
      },
      {
        label: "Người dùng",
        // icon: <i className="fa-solid fa-user"></i>,
        path: PATH_APP.user.root,
        key: PATH_APP.user.root,
        permission: [POLICIES.READ_USER, POLICIES.READ_USERGROUP], //
      },
      {
        label: "Danh sách chi nhánh",
        path: PATH_APP.branch.root,
        key: PATH_APP.branch.root,
        permission: [POLICIES.READ_BRANCH], //
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
            permission: [POLICIES.READ_PRODUCTGROUP], //
          },
          {
            label: "Danh sách hãng sản xuất",
            path: PATH_APP.worldPharma.manufacturer,
            key: PATH_APP.worldPharma.manufacturer,
            icon: <HomeOutlined />,
            permission: [POLICIES.READ_MANUFACTURER], //
          },
          {
            label: "Xếp hạng nhà cung cấp",
            path: PATH_APP.worldPharma.ranking,
            key: PATH_APP.worldPharma.ranking,
            icon: <TrophyOutlined />,
            permission: [POLICIES.READ_RANKING], //
          },
          {
            label: "Đơn vị tính",
            path: PATH_APP.worldPharma.unit,
            key: PATH_APP.worldPharma.unit,
            icon: <DollarOutlined />,
            permission: [POLICIES.READ_UNIT], //
          },
          {
            label: "Danh sách thuốc",
            path: PATH_APP.worldPharma.medicine,
            key: PATH_APP.worldPharma.medicine,
            icon: <DatabaseOutlined />,
            permission: [POLICIES.READ_MEDICINE], //
          },
          {
            label: "Cấu hình giảm giá",
            path: PATH_APP.configDiscount.root,
            key: PATH_APP.configDiscount.root,
            permission: [POLICIES.READ_CONFIGDISCOUNT], //
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
            label: "Loại khách hàng",
            path: PATH_APP.typePharmacy.root,
            key: PATH_APP.typePharmacy.root,
            icon: <i className="fa-solid fa-truck-medical"></i>,
            permission: [POLICIES.READ_CUSTOMERGROUP],
          },
          {
            label: "Nhóm khách hàng",
            path: PATH_APP.groupPharmacy.root,
            key: PATH_APP.groupPharmacy.root,
            icon: <i className="fa-solid fa-notes-medical"></i>,
            permission: [POLICIES.READ_CUSTOMER],
          },
          {
            label: "Thời gian báo cáo lương",
            icon: <i className="fa-solid fa-clock-rotate-left"></i>,
            path: PATH_APP.cronSalary.root,
            key: PATH_APP.cronSalary.root,
            permission: [POLICIES.READ_CONFIGREPORTSALARYAUTO],
          },
        ],
      },
    ],
  },
  // Báo cáo
  {
    label: "Báo cáo",
    key: "report",
    icon: <i className="fa-solid fa-code-branch"></i>,
    permission: [...permissionReport],
    children: [
      {
        label: "Báo cáo tổng quan",
        path: PATH_APP.reportOverview.root,
        key: PATH_APP.reportOverview.root,
        permission: [POLICIES.READ_REPORTOVERVIEW, POLICIES.READ_REPORTOVERVIEWB2B, POLICIES.READ_REPORTOVERVIEWB2C],//
      },
      {
        label: "Báo cáo lương",
        key: "salary",
        permission: [POLICIES.READ_REPORTSALARY, POLICIES.READ_REPORTSALARYPARTNER],
        children: [
          {
            label: "Báo cáo lương trình dược viên",
            path: PATH_APP.report.employee,
            key: PATH_APP.report.employee,
            permission: [POLICIES.READ_REPORTSALARY],
          },
          {
            label: "Báo cáo lương cộng tác viên",
            path: PATH_APP.reportSalaryPartner.root,
            key: PATH_APP.reportSalaryPartner.root,
            permission: [POLICIES.READ_REPORTSALARYPARTNER],
          },
        ],
      },
      {
        label: "Báo cáo doanh thu",
        key: "revenue",
        permission: [
          POLICIES.READ_REPORTREVENUEPERSONALEMPLOYEE,
          POLICIES.READ_REPORTREVENUEPERSONALPARTNER,
          POLICIES.READ_REPORTREVENUETEAMEMPLOYEE,
          POLICIES.READ_REPORTREVENUETEAMPARTNER,
        ],
        children: [
          {
            label: "Cá nhân",
            key: "invidual",
            permission: [
              POLICIES.READ_REPORTREVENUEPERSONALEMPLOYEE,
              POLICIES.READ_REPORTREVENUEPERSONALPARTNER,
            ],
            children: [
              // {
              //   label: "Đại lý",
              //   path: PATH_APP.reportIndividualEmployeeSeller.root,
              //   key: PATH_APP.reportIndividualEmployeeSeller.root,
              //   permission: [POLICIES.READ_REPORTSALARYPARTNER],
              // },
              {
                label: "Trình dược viên",
                path: PATH_APP.reportIndividualEmployeeSeller.root,
                key: PATH_APP.reportIndividualEmployeeSeller.root,
                permission: [POLICIES.READ_REPORTREVENUEPERSONALEMPLOYEE],
              },
              {
                label: "Cộng tác viên",
                path: PATH_APP.reportIndividualCollaborator.root,
                key: PATH_APP.reportIndividualCollaborator.root,
                permission: [POLICIES.READ_REPORTREVENUEPERSONALPARTNER],
              },
            ],
          },
          {
            label: "Đội nhóm",
            key: "group",
            permission: [
              POLICIES.READ_REPORTREVENUETEAMEMPLOYEE,
              POLICIES.READ_REPORTREVENUETEAMPARTNER,
            ],
            children: [
              // {
              //   label: "Đại lý",
              //   path: PATH_APP.reportIndividualEmployeeSeller.root,
              //   key: PATH_APP.reportIndividualEmployeeSeller.root,
              //   permission: [POLICIES.READ_REPORTSALARYPARTNER],
              // },
              {
                label: "Trình dược viên",
                path: PATH_APP.reportGroupEmployeeSeller.root,
                key: PATH_APP.reportGroupEmployeeSeller.root,
                permission: [POLICIES.READ_REPORTREVENUETEAMEMPLOYEE],
              },
              {
                label: "Cộng tác viên",
                path: PATH_APP.reportGroupCollaborator.root,
                key: PATH_APP.reportGroupCollaborator.root,
                permission: [POLICIES.READ_REPORTREVENUETEAMPARTNER],
              },
            ],
          },
        ],
      },
      {
        label: "Báo cáo quản trị",
        path: PATH_APP.costManagement.root,
        key: PATH_APP.costManagement.root,
        permission: [POLICIES.READ_SHIPPINGCOST], //
      },
      {
        label: "Phiếu lương",
        path: PATH_APP.vouchers.salary,
        key: PATH_APP.vouchers.salary,
        permission: [
          POLICIES.READ_VOUCHERSALARYPARTNER,
          POLICIES.READ_VOUCHERSALARYEMPLOYEE,
        ], //
      },
    ],
  },
  {
    label: "Quản lý công việc",
    key: "todoList",
    icon: <i className="fa-solid fa-clipboard-list"></i>,
    permission: [POLICIES.READ_TODOLIST, POLICIES.READ_TODOCONFIGSTATUS], //
    children: [
      {
        label: "Quản lý công việc",
        icon: <ApartmentOutlined />,
        path: PATH_APP.todoList.workBoard,
        key: PATH_APP.todoList.workBoard,
        permission: [POLICIES.READ_TODOLIST], //
      },
      {
        label: "Cấu hình trạng thái",
        icon: <AppstoreFilled />,
        path: PATH_APP.todoList.statusConfig,
        key: PATH_APP.todoList.statusConfig,
        permission: [POLICIES.READ_TODOCONFIGSTATUS], //
      },
    ],
  },

  // Nhà cung cấp//
  {
    label: "Nhà cung cấp",
    icon: <i className="fa-solid fa-cubes"></i>,
    key: "supplier",
    permission: [...permissionSupplier], //
    children: [
      {
        label: "Danh sách nhà cung cấp",
        path: PATH_APP.supplier.root,
        key: PATH_APP.supplier.root,
        permission: [POLICIES.READ_SUPPLIER], //
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.orderSupplier.root,
        key: PATH_APP.orderSupplier.root,
        permission: [POLICIES.READ_ORDERSUPPLIER], //
      },
      {
        label: "Doanh số tích luỹ",
        path: PATH_APP.report.supplier,
        key: PATH_APP.report.supplier,
        permission: [POLICIES.READ_CUMULATIVESALESSUPPLIER], //
      },

      {
        label: "Phiếu",
        path: PATH_APP.vouchers.supplier,
        key: PATH_APP.vouchers.supplier,
        permission: [POLICIES.READ_VOUCHERSUPPLIER], //
      },
    ],
  },

  // Nhà thuốc
  {
    label: "Nhà thuốc",
    icon: <i className="fa-solid fa-house-chimney-medical"></i>,
    key: "pharmacy",
    permission: [...permissionPharma], //
    children: [
      {
        label: "Danh sách nhà thuốc",
        path: PATH_APP.pharmacy.root,
        key: PATH_APP.pharmacy.root,
        permission: [POLICIES.READ_PHARMAPROFILE], //
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.bill.pharmacy,
        key: PATH_APP.bill.pharmacy,
        permission: [POLICIES.READ_BILLPHARMACY], //
      },
      {
        label: "Đơn hàng tạm",
        path: PATH_APP.quotation.pharmacy,
        key: PATH_APP.quotation.pharmacy,
        permission: [POLICIES.READ_QUOTATIONPHARMACY], //
      },
      {
        label: "Luỹ kế mặt hàng",
        path: PATH_APP.bill.lk,
        key: PATH_APP.bill.lk,
        permission: [POLICIES.READ_CUMULATIVEEVENT], //
      },
      {
        label: "Phiếu",
        path: PATH_APP.vouchers.pharmacy,
        key: PATH_APP.vouchers.pharmacy,
        permission: [POLICIES.READ_VOUCHERPHARMACY], //
      },
      {
        label: "Hợp đồng khoán",
        path: PATH_APP.freelanceContractPharmacy.root,
        key: PATH_APP.freelanceContractPharmacy.root,
        permission: [POLICIES.READ_CONTRACTPHARMACY], //
      },
    ],
  },
  
  // Đại lý
  // {
  //   label: "Đại lý",
  //   key: "agent",
  //   icon: <i className="fa-solid fa-code-branch"></i>,
  //   // permission: [...permissionCollaborator], //
  //   children: [
  //     {
  //       label: "Quản lý đại lý",
  //       path: PATH_APP.collaborator.root,
  //       key: PATH_APP.collaborator.root,
  //       permission: [POLICIES.READ_PARTNER, POLICIES.READ_PARTNERGROUP], //
  //     },
  //     {
  //       label: "Đơn hàng",
  //       path: PATH_APP.bill.collaborator,
  //       key: PATH_APP.bill.collaborator,
  //       permission: [POLICIES.READ_BILLPARTNER], //
  //     },
  //     {
  //       label: "Đơn hàng tạm",
  //       path: PATH_APP.quotation.collaborator,
  //       key: PATH_APP.quotation.collaborator,
  //       permission: [POLICIES.READ_QUOTATIONPARTNER], //
  //     },
  //     {
  //       label: "Tạo đơn hàng tạm",
  //       path: PATH_APP.bill.createCollaborator,
  //       key: PATH_APP.bill.createCollaborator,
  //       permission: [POLICIES.WRITE_QUOTATIONPARTNER], //
  //     },
  //     {
  //       label: "Phiếu đơn hàng",
  //       path: PATH_APP.vouchers.partner,
  //       key: PATH_APP.vouchers.partner,
  //       permission: [POLICIES.READ_VOUCHERBILLPARTNER], //
  //     },
  //     {
  //       label: "Quản lý sản phẩm mượn",
  //       path: PATH_APP.product.borrow,
  //       key: PATH_APP.product.borrow,
  //       permission: [
  //         POLICIES.READ_BORROWPRODUCT,
  //         POLICIES.READ_STATUSBORROWPRODUCT,
  //       ], //
  //     },
  //   ],
  // },

  //Trình dược viên
  {
    label: "Trình dược viên",
    key: "employeeManagement",
    icon: <i className="fa-solid fa-clipboard-list"></i>,
    permission: [...permissionEmployee], //
    children: [
      {
        label: "Quản lý trình dược viên",
        path: PATH_APP.employee.root,
        key: PATH_APP.employee.root,
        permission: [POLICIES.READ_EMPLOYEE, POLICIES.READ_EMPLOYEEGROUP], //
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.bill.employee,
        key: PATH_APP.bill.employee,
        permission: [POLICIES.READ_BILLEMPLOYEE], //
      },
      {
        label: "Đơn hàng tạm",
        path: PATH_APP.quotation.employee,
        key: PATH_APP.quotation.employee,
        permission: [POLICIES.READ_QUOTATIONEMPLOYEE], //
      },
      {
        label: "Tạo đơn hàng tạm",
        path: PATH_APP.bill.createEmployee,
        key: PATH_APP.bill.createEmployee,
        permission: [POLICIES.WRITE_QUOTATIONEMPLOYEE], //
      },
    ],
  },
  {
    label: "Cộng tác viên",
    key: "collaboratorManagement",
    icon: <i className="fa-solid fa-circle-nodes"></i>,
    permission: [...permissionCollaborator], //
    children: [
      {
        label: "Quản lý cộng tác viên",
        path: PATH_APP.collaborator.root,
        key: PATH_APP.collaborator.root,
        permission: [POLICIES.READ_PARTNER, POLICIES.READ_PARTNERGROUP], //
      },
      {
        label: "Đơn hàng",
        path: PATH_APP.bill.collaborator,
        key: PATH_APP.bill.collaborator,
        permission: [POLICIES.READ_BILLPARTNER], //
      },
      {
        label: "Đơn hàng tạm",
        path: PATH_APP.quotation.collaborator,
        key: PATH_APP.quotation.collaborator,
        permission: [POLICIES.READ_QUOTATIONPARTNER], //
      },
      {
        label: "Tạo đơn hàng tạm",
        path: PATH_APP.bill.createCollaborator,
        key: PATH_APP.bill.createCollaborator,
        permission: [POLICIES.WRITE_QUOTATIONPARTNER], //
      },
      {
        label: "Phiếu đơn hàng",
        path: PATH_APP.vouchers.partner,
        key: PATH_APP.vouchers.partner,
        permission: [POLICIES.READ_VOUCHERBILLPARTNER], //
      },
      {
        label: "Quản lý sản phẩm mượn",
        path: PATH_APP.product.borrow,
        key: PATH_APP.product.borrow,
        permission: [
          POLICIES.READ_BORROWPRODUCT,
          POLICIES.READ_STATUSBORROWPRODUCT,
        ], //
      },
    ],
  },
  {
    label: "Đơn hàng",
    icon: <i className="fa-solid fa-boxes-packing"></i>,
    key: "bill",
    permission: [...permissionBill],//
    children: [
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
    ],
  },
];
