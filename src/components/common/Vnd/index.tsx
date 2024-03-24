import React, { useMemo } from "react";
import "./index.scss";
type typeEnum = {
  success: "success";
  danger: "danger";
};
type propsType = {
  type?: keyof typeEnum;
};
export default function Vnd({
  type = "success",
}: propsType): React.JSX.Element {
  const backgroundColor = useMemo(() => {
    switch (type) {
      case "success":
        return "#4AAC4E";
      case "danger":
        return "#ff4d4f";
      default:
        return "#4AAC4E";
    }
  }, [type]);
  return (
    <span
      style={{
        backgroundColor,
      }}
      className="VND-Exchange"
    >
      VNĐ
    </span>
  );
}
