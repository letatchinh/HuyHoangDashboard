import { MenuOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState } from "react";
import { Checkbox, message, Radio, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetConfigDiscounts,
  useUpdateConfigDiscount,
} from "../configDiscount.hook";
import { ConfigItem } from "../configDiscount.modal";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import toastr from "toastr";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        if ((child as React.ReactElement).key === "name") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <div
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              >
                {child}
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const ConfigDiscount: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [data, isLoading] = useGetConfigDiscounts();
  const [, updateConfig] = useUpdateConfigDiscount();
  useEffect(() => {
    if (data?.length) {
      setDataSource(data);
    }
  }, [data]);

  const handleCheckbox = (e: any, item: any, index?: number) => {
    try {
      const cloneData = [...dataSource];
      const newData : any  = cloneData?.map((i: any, indexx: number) => {
        if (indexx === index) {
          return {
            ...i,
            status: e.target.checked,
          };
        };
        return i;
      });
      updateConfig(newData);
      setDataSource(newData);
    } catch (error) {
      console.log(error);
    };
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    // if (!isMath) { // check permission
    //   return;
    // };
    if (active.id !== over?.id) {
      try {
        updateConfig(dataSource);
        setDataSource((previous) => {
          const activeIndex = previous.findIndex((i: any) => i.key === active.id);
          const overIndex = previous.findIndex((i: any) => i.key === over?.id);
          return arrayMove(previous, activeIndex, overIndex);
        });
      } catch (error: any) {
        console.log(error);
        // toastr.error(error.message || "Có lỗi xảy ra" );
      };
    }
  };
  const columns: ColumnsType<ConfigItem> = [
    {
      key: "sort",
      width: 50,
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kiểu sắp xếp",
      dataIndex: "sortType",
      render: (value) => (value === -1 ? "Giảm dần" : "Tăng dần"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 100,
      render: (value, rc, index) => <Checkbox onChange={(e : any) => handleCheckbox(e,rc,index)} checked={value} />,
    },
  ];

  return (
    <div>
      <Breadcrumb title="Cấu hình giảm giá ưu tiên" linkTo="/config-discount" />
      <WhiteBox>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i: any) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              bordered
              size="small"
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
              loading={isLoading}
            />
          </SortableContext>
        </DndContext>
      </WhiteBox>
    </div>
  );
};

export default ConfigDiscount;

// import React, { useEffect, useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Breadcrumb from "~/components/common/Breadcrumb";
// import WhiteBox from "~/components/common/WhiteBox";
// import { useGetConfigDiscounts, useUpdateConfigDiscount } from "../configDiscount.hook";

// const ConfigDiscount: React.FC = () => {
//   const [items, setItems] = useState([]);
//   const [data, isLoading] = useGetConfigDiscounts();
//   const [, updateConfig] = useUpdateConfigDiscount();
//   useEffect(() => {
//     if (data?.length) {
//       setItems(data);
//     };
//   }, [data]);
//   // Function to handle item reordering
//   const onDragEnd = (result: any) => {
//     if (!result.destination) {
//       return;
//     }
//     const newItems = Array.from(items);
//     const [movedItem] = newItems.splice(result.source.index, 1);
//     newItems.splice(result.destination.index, 0, movedItem);
//     updateConfig(newItems);
//     setItems(newItems);
//   };
//   return (
//     <div>
//       <Breadcrumb title="Cấu hình giảm giá ưu tiên" linkTo="/config-discount" />
//       <WhiteBox>
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="droppable">
//             {(provided) => (
//               <ul {...provided.droppableProps} ref={provided.innerRef}>
//                 {items?.map((item: any, index) => (
//                   <Draggable key={item?.key} draggableId={item?.key} index={index}>
//                     {(provided) => (
//                       <div
//                         className="config-discount__item"
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         ref={provided.innerRef}
//                       >
//                         {item?.name}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </ul>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </WhiteBox>
//     </div>
//   );
// };

// export default ConfigDiscount;
