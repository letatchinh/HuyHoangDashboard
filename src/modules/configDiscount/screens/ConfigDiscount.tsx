import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MenuOutlined,
} from "@ant-design/icons";
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
import React, { useEffect, useMemo, useState } from "react";
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
import { useDispatch } from "react-redux";
import { useResetState } from "~/utils/hook";
import { configDiscountSliceAction } from "../redux/reducer";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import useNotificationStore from "~/store/NotificationContext";

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
  const dispatch = useDispatch();
  const resetState = () => {
    return dispatch(configDiscountSliceAction.resetAction());
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [data, isLoading] = useGetConfigDiscounts();
  const [, updateConfig] = useUpdateConfigDiscount(() => resetState());
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_CONFIGDISCOUNT);
  const { onNotify } = useNotificationStore();

  useEffect(() => {
    if (data?.length) {
      setDataSource(data);
    };
  }, [data]);
  

  const handleCheckbox = (e: any, item: any, index?: number) => {
    try {
      const cloneData = [...dataSource];
      const newData: any = cloneData?.map((i: any, indexx: number) => {
        if (indexx === index) {
          return {
            ...i,
            status: e.target.checked,
          };
        }
        return i;
      });
      updateConfig({config: newData});
      setDataSource(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortType = ( index: number ,e: number) => {
    try {
      const newData = [...dataSource];
      const newSortData = newData?.map((i: object, objIndex: number) => {
        if (objIndex === index) {
          return {
            ...i,
            sortType: e,
          };
        }
        return i;
      });
      updateConfig({config: newSortData});
      setDataSource([...newSortData]);
    } catch (error) {
      onNotify?.error("Có lỗi xảy ra");
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!canUpdate) {
      // check permission
      return;
    }
    if (active.id !== over?.id) {
      try {
        updateConfig(dataSource);
        setDataSource((previous) => {
          const activeIndex = previous.findIndex(
            (i: any) => i.key === active.id
          );
          const overIndex = previous.findIndex((i: any) => i.key === over?.id);
          return arrayMove(previous, activeIndex, overIndex);
        });
      } catch (error: any) {
        console.log(error);
        // toastr.error(error.message || "Có lỗi xảy ra" );
      }
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
      width: "20%",
      // render: (value) => (value === -1 ? "Giảm dần" : "Tăng dần"),
      render: (value,rc, index) => {
        return (
          <>
            <span>
              {value === -1 ? "Giảm dần" : "Tăng dần"}
            </span> &nbsp;
            {value === 1 ? (
              <ArrowUpOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handleSortType(index,-1)}
              />
            ) : (
              <ArrowDownOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handleSortType(index,1)}
              />
            )}
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 100,
      render: (value, rc, index) => {
        return (
          <Checkbox
            disabled={!canUpdate}
            onChange={(e: any) => handleCheckbox(e, rc, index)}
            checked={value}
          />
        );
      },
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


