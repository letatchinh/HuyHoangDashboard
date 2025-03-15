import React from "react";
type propsType = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
};
export default function WhiteBox({
  children,
  className,
  noPadding,
  style = {},
  title,
}: propsType): React.JSX.Element {
  return (
    <div
      style={{ marginTop: "20px", ...style }}
      className={`whiteBox ${className ?? ""} ${noPadding ? "p-0" : ""}`}
    >
      {title && (
        <div className="whiteBox--header">
          <h5 style={{margin:0}}>{title}</h5>
        </div>
      )}
      <div className="whiteBox--body">{children}</div>
    </div>
  );
}
