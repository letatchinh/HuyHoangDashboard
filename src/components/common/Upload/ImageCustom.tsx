import { Image, ImageProps } from "antd";
import React from "react";
import { BASE_URL } from "~/constants/defaultValue";
export default function ImageCustom(props: ImageProps): React.JSX.Element {
  return (
    <Image
      className="imageCustom"
      {...props}
      src={`${BASE_URL}api/image?pathFile=${props?.src}`}
    />
  );
}
