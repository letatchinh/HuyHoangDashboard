// import { ConfigProvider, Steps, StepsProps } from "antd";
// import { StepProps } from "antd/lib/index";
// import dayjs from "dayjs";
// import { get, keys } from "lodash";
// import React, { useEffect, useMemo, useState } from "react";
// interface propsType extends StepsProps {
//   statuses: any;
//   statusesVi: any;
//   currentStatus?: string;
//   historyStatus?: any;
// };
// export default function StepStatus({
//   statuses,
//   statusesVi,
//   currentStatus,
//   historyStatus,
//   ...props
// }: propsType): React.JSX.Element {
  
//   // const [current,setCurrent] = useState(1);
//   const items: StepProps[] = useMemo(() => {
//     const statusMap: StepProps[] = keys(statuses)?.map((status: any) => {
//       return {
//         title: get(statusesVi,status,''),
//         description: get(historyStatus, status)
//           ? dayjs(get(historyStatus, status)).format("DD/MM/YYYY HH:mm:ss")
//           : "",
//         status: status === currentStatus ? "finish" : "wait",
//       };
//     });
//     return statusMap;
//   }, [historyStatus,currentStatus]);
//   return (
//     <ConfigProvider 
//     theme={{
//         components: {
//             Steps: {
//               fontSize : 12,
//               lineHeight : 0.8,
              
//           },
//         },
//       }}
//     >
//     <Steps
//       labelPlacement="vertical"
//       items={items}
//       className="step-custom"
//       {...props}
//       />
//       </ConfigProvider>
//   );
// }
