import Auth from "~/modules/auth";
import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Dashboard/Homepage";
import Supplier from "~/pages/Dashboard/Supplier";
import ProductGroupPage from "~/pages/Dashboard/ProductGroup";
import ManufacturerPage from "~/pages/Dashboard/Manufacturer";
import RankingManufacturerPage from "~/pages/Dashboard/RankingManufacturer";
import Branch from "~/pages/Dashboard/Branch";
import StatusConfig from "~/pages/Dashboard/StatusConfig";
import EmployeePage from "~/pages/Dashboard/Employee";
import UserPage from "~/pages/Dashboard/User";
import VouchersPage from "~/pages/Dashboard/Vouchers";
import Unit from "~/pages/Dashboard/Unit";
import MedicinePage from "~/pages/Dashboard/Medicine";
import ProductPage from "~/pages/Dashboard/Product";
import ConfigDiscountPage from "~/pages/Dashboard/ConfigDiscount";
import Pharmacy from "~/pages/Dashboard/Pharmacy";
import ProductsAll from "~/pages/Dashboard/ProductsAll";
import Bill from "~/pages/Dashboard/Bill";
import UpdateBill from "~/pages/Dashboard/Bill/UpdateBill";
import Quotation from "~/pages/Dashboard/Quotation";
import WorkBoardPage from "~/pages/Dashboard/WorkBoard";
import WorkSprintPage from "~/pages/Dashboard/WorkSprint";
import WorkListPage from "~/pages/Dashboard/WorkList";
import WorkTaskPage from "~/pages/Dashboard/WorkTask";
import BotNotificationPage from "~/pages/Dashboard/BotNotification";
import PharmacyDetail from "~/modules/pharmacy/screens/PharmacyDetail";
import Lk from "~/pages/Dashboard/Lk";
import OrderSupplier from "~/pages/Dashboard/OrderSupplier";
import UpdateOrderSupplier from "~/pages/Dashboard/OrderSupplier/UpdateOrderSupplier";
import { FreelanceContractPharmacyPage } from "~/pages/Dashboard/FreelanceContractPharmacy";
import RevenueSupplier from "~/modules/supplier/components/Revenue";
import TotalRevenueList from "~/modules/supplier/components/Revenue/TotalRevenueList";
import CostManagement from "~/pages/Dashboard/CostManagement";
import SalesGroupPage from "~/pages/Dashboard/SalesGroup";
import BaseSalaryPage from "~/pages/Dashboard/BaseSalary";
import BenefitConfigurationPage from "~/pages/Dashboard/BenefitConfiguration";
import ReportEmployeePage from "~/pages/Dashboard/ReportEmployee";
import ReportSupplierPage from "~/pages/Dashboard/ReportSupplier";
import CronSalaryPage from "~/pages/Dashboard/CronSalary";
import SaleChannel from "~/pages/Dashboard/SaleChannel";
import TypePharmacy from "~/pages/Dashboard/TypePharmacy";
import GroupPharmacy from "~/pages/Dashboard/GroupPharmacy";
import CollaboratorPage from "~/pages/Dashboard/Collaborator";
import ReportProductSupplier from "~/pages/Dashboard/ReportProductSupplier";
import ReportOverview from "~/pages/Dashboard/ReportOverview";
import NotificationPage from "~/pages/Dashboard/Notification";
import ReportSalaryPartnerPage from "~/pages/Dashboard/ReportSalaryPartner"; 
import ProductBorrow from "~/modules/product/components/ProductBorrow";
import SelectDefaultWarehouse from "~/modules/warehouse/components/SelectDefaultWarehouse";
import ReportIndividualCollaborator from "~/pages/Dashboard/ReportIndividualCollaborator";
import ReportIndividualEmployeeSeller from "~/pages/Dashboard/ReportIndividualEmployeeSeller";
import ReportGroup from "~/pages/Dashboard/ReportGroupCollaborator";
import ReportGroupEmployeeSeller from "~/pages/Dashboard/ReportGroupEmployeeSeller";
import PharmacyDetail_v2 from "~/modules/pharmacy/screens/PharmacyDetail_v2";
import EmployeeDetail from "~/modules/employee/screen/EmployeeDetail";
import CollaboratorDetail from "~/modules/collaborator/screens/CollaboratorDetail";
import UserDetail from "~/modules/user/screen/UserDetail";
import ProductGroupDetail from "~/modules/productGroup/components/ProductGroupDetail";
import ManufacturerDetail from "~/modules/manufacturer/components/ManufacturerDetail";
import RankingDetail from "~/modules/ranking/components/RankingDetail";
import ProductUnitDetail from "~/modules/productUnit/component/ProductUnitDetail";
import CustomerSegmentation from "~/pages/Dashboard/CustomerSegmentation";
import SaleChannelDetail from "~/modules/saleChannel/components/SaleChannelDetail";
import TypePharmacyDetail from "~/modules/typePharmacy/components/TypePharmacyDetail";
import GroupPharmacyDetail from "~/modules/groupPharmacy/components/GroupPharmacyDetail";
import Inventory from "~/pages/Dashboard/Warehouse/Inventory";
import Coupon from "~/modules/coupon/screens/Coupon";
import ReportShipPage from "~/pages/Dashboard/ReportShip";
import ReportSubFeePage from "~/pages/Dashboard/ReportSubFee";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  
  // Supplier
  { path: PATH_APP.supplier.root, Component: Supplier },

  //Revenue Supplier
  { path: PATH_APP.revenueSupplier.revenue, Component: RevenueSupplier },
  { path: PATH_APP.revenueSupplier.revenueDetail, Component: RevenueSupplier },
  { path: PATH_APP.revenueSupplier.revenueAll, Component: TotalRevenueList },

  // worldPharma
  { path: PATH_APP.worldPharma.productGroup, Component: ProductGroupPage },
  { path: PATH_APP.worldPharma.productGroupDetail, Component: ProductGroupDetail },
  { path: PATH_APP.worldPharma.manufacturer, Component: ManufacturerPage },
  { path: PATH_APP.worldPharma.manufacturerDetail, Component: ManufacturerDetail },
  { path: PATH_APP.worldPharma.ranking, Component: RankingManufacturerPage },
  { path: PATH_APP.worldPharma.rankingDetail, Component: RankingDetail },
  { path: PATH_APP.worldPharma.unit, Component:Unit  },
  { path: PATH_APP.worldPharma.unitDetail, Component: ProductUnitDetail  },
  { path: PATH_APP.worldPharma.medicine, Component:MedicinePage  },

  // Branch
  { path: PATH_APP.branch.root, Component: Branch },

  // Product
  { path: PATH_APP.product.edit, Component: ProductPage },
  { path: PATH_APP.product.borrow, Component: ProductBorrow },

  // Bill
  { path: PATH_APP.bill.root, Component: Bill },
  { path: PATH_APP.bill.update, Component: UpdateBill },
  { path: PATH_APP.quotation.root, Component: Quotation },
  { path: PATH_APP.bill.lk, Component: Lk },
  
  //Bill of pharmacy
  { path: PATH_APP.bill.pharmacy, Component: Bill },
  { path: PATH_APP.bill.updatePharmacy, Component: UpdateBill },
  { path: PATH_APP.quotation.pharmacy, Component: Quotation },
  
  //Bill of employee
  { path: PATH_APP.bill.employee, Component: Bill },
  { path: PATH_APP.bill.updateEmployee, Component: UpdateBill },
  { path: PATH_APP.quotation.employee, Component: Quotation },

  //Bill of collaborator
  { path: PATH_APP.bill.collaborator, Component: Bill },
  { path: PATH_APP.bill.updateCollaborator, Component: UpdateBill },
  { path: PATH_APP.quotation.collaborator, Component: Quotation },

  // TodoList
  { path: PATH_APP.todoList.statusConfig, Component: StatusConfig },

  // Trình dược viên
  { path: PATH_APP.todoList.workBoard, Component: WorkBoardPage },
  { path: PATH_APP.employee.root, Component: EmployeePage },
  { path: PATH_APP.employee.root, Component: EmployeePage },
  { path: PATH_APP.employee.detail, Component: EmployeeDetail },
  
  // User
  { path: PATH_APP.user.root, Component: UserPage },
  { path: PATH_APP.user.detail, Component: UserDetail },

  //ConfigDiscount
  { path: PATH_APP.vouchers.root, Component: VouchersPage },
  { path: PATH_APP.vouchers.pharmacy, Component: VouchersPage },
  { path: PATH_APP.vouchers.supplier, Component: VouchersPage },
  { path: PATH_APP.vouchers.salary, Component: VouchersPage },
  { path: PATH_APP.vouchers.partner, Component: VouchersPage },
  { path: PATH_APP.configDiscount.root, Component: ConfigDiscountPage },
  

  // Pharmacy
  { path: PATH_APP.pharmacy.root, Component: Pharmacy },
  { path: PATH_APP.pharmacy.detail, Component: PharmacyDetail_v2 },

  // Bot Notification
  { path: PATH_APP.botNotification.root, Component: BotNotificationPage },

  // Products All
  { path: PATH_APP.productAll.root, Component: ProductsAll },
  
  //Work Management
  { path: PATH_APP.todoList.workSprint, Component: WorkSprintPage },
  { path: PATH_APP.todoList.workList, Component: WorkListPage },
  { path: PATH_APP.todoList.workTask, Component: WorkTaskPage },
  
  
  // Order Supplier
  { path: PATH_APP.orderSupplier.root, Component: OrderSupplier},
  { path: PATH_APP.orderSupplier.update, Component: UpdateOrderSupplier},

  // Freelance Contract Pharmacy
  { path: PATH_APP.freelanceContractPharmacy.root, Component: FreelanceContractPharmacyPage},
  {path: PATH_APP.costManagement.root, Component: CostManagement},
  
  // Nhóm bán hàng
  { path: PATH_APP.salesGroup.root, Component: SalesGroupPage },
  // Cấu hình Lương cơ bản vùng
  { path: PATH_APP.baseSalary.root, Component: BaseSalaryPage },
  // Cấu hình Hoa hồng
  { path: PATH_APP.benefitConfiguration.root, Component: BenefitConfigurationPage },
  // Báo cáo
  { path: PATH_APP.report.employee, Component: ReportEmployeePage },
  { path: PATH_APP.report.supplier, Component: ReportSupplierPage },
  { path: PATH_APP.report.ship, Component: ReportShipPage },
  { path: PATH_APP.report.subFee, Component: ReportSubFeePage },
  
  // Configuration Cron Time
  // { path: PATH_APP.configurationCronTime.root, Component: ConfigurationCronTime},
  
  // Thời gian báo cáo lương
  { path: PATH_APP.cronSalary.root, Component: CronSalaryPage },
  
  // Kênh bán hàng
  { path: PATH_APP.saleChannel.root, Component: SaleChannel},
  { path: PATH_APP.saleChannel.detail, Component: SaleChannelDetail},
  
  // Nhánh khách hàng
  { path: PATH_APP.typePharmacy.root, Component: TypePharmacy},
  { path: PATH_APP.typePharmacy.detail, Component: TypePharmacyDetail},
  
  // Nhóm khách hàng B2B
  { path: PATH_APP.groupPharmacy.root, Component:  GroupPharmacy},
  { path: PATH_APP.groupPharmacy.detail, Component:  GroupPharmacyDetail},
  
  // Khách hàng B2C
  { path: PATH_APP.collaborator.root, Component: CollaboratorPage},
  { path: PATH_APP.collaborator.detail, Component: CollaboratorDetail},

  // 
  { path: PATH_APP.reportProductSupplier.root, Component: ReportProductSupplier},
  { path: PATH_APP.reportSalaryPartner.root, Component: ReportSalaryPartnerPage},

  { path: PATH_APP.reportOverview.root, Component: ReportOverview},
    // Thôgng báo
  { path: PATH_APP.myNotification.root, Component: NotificationPage},

  // Báo cáo doanh thu cá nhân
  { path: PATH_APP.reportIndividualCollaborator.root, Component: ReportIndividualCollaborator},
  { path: PATH_APP.reportIndividualEmployeeSeller.root, Component: ReportIndividualEmployeeSeller},

  // Báo cáo doanh thu đội nhóm
  { path: PATH_APP.reportGroupCollaborator.root, Component: ReportGroup},
  { path: PATH_APP.reportGroupEmployeeSeller.root, Component: ReportGroupEmployeeSeller },
  
    // Kho 
    { path: PATH_APP.warehouse.setting, Component: SelectDefaultWarehouse },
    { path: PATH_APP.warehouse.inventory, Component: Inventory },

  // Mã giảm giá
  { path: PATH_APP.coupon.root, Component: Coupon},

  // Phân hệ khách hàng B2B/ B2C
  { path: PATH_APP.customerSegmentation.root, Component: CustomerSegmentation},

  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

