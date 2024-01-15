// import React, { useMemo } from 'react';
// import { Select, Space } from 'antd';
// import { get } from 'lodash';
// import { TASK_ITEM_STATUS_NAME } from '~/constants/defaultValue';

// interface StatusItem {
//   _id: string;
//   value: string;
//   backgroundColor: string;
//   color: string;
//   name: string;
//   justAdmin: boolean;
// }

// interface SelectStatusTaskProps {
//   handleChange: (value: string) => void;
//   defaultValue: string;
//   value: string;
//   listStatus: StatusItem[];
//   initStatusValue?: StatusItem;
// }

// function SelectStatusTask({
//   handleChange,
//   defaultValue,
//   value,
//   listStatus,
//   initStatusValue = {},
// }: SelectStatusTaskProps) {
//   const listStatusMap = useMemo(() => {
//     return listStatus?.reduce((result, item) => {
//       result[item._id] = {
//         value: item?.value,
//         backgroundColor: item.backgroundColor,
//         color: item.color,
//         name: item.value,
//         justAdmin: item.justAdmin,
//       };
//       return result;
//     }, {});
//   }, [listStatus]);

//   const styleListStatus = useMemo(() => ({
//     ...{ [get(initStatusValue, 'value', 'không xác định')]: initStatusValue },
//     ...listStatusMap,
//   }), [initStatusValue, listStatusMap]);

//   if (!listStatus?.length) return null;

//   return (
//     <Select
//       className="selectTask-custom"
//       dropdownMatchSelectWidth={false}
//       style={{
//         width: 'max-content',
//         '--select-by-status-bg': styleListStatus?.[value]?.backgroundColor,
//         '--select-by-status-color': styleListStatus?.[value]?.color,
//         borderRadius: '9px',
//       }}
//       defaultValue={defaultValue}
//       onSelect={handleChange}
//       placement={'bottomLeft'}
//       value={value}
//     >
//       {Object.keys(listStatusMap).map((status) => (
//         <Select.Option
//           label={listStatusMap?.[status]?.value}
//           key={status}
//           value={status}
//           style={{ width: 'fill-content' }}
//         >
//           <Space style={{ width: '100%' }}>
//             <Space>
//               <div
//                 className="select_option_circle"
//                 style={{ backgroundColor: listStatusMap?.[status]?.backgroundColor }}
//               ></div>
//             </Space>
//             <Space style={{ flexGrow: 1 }}>
//               {listStatusMap?.[status]?.name || value}
//             </Space>
//           </Space>
//         </Select.Option>
//       ))}
//     </Select>
//   );
// }

// export default SelectStatusTask;
