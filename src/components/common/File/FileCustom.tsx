import { Flex, Typography } from "antd";
import React, { useMemo } from "react";
import { BASE_URL } from "~/constants/defaultValue";
type propsType = {
  src: any;
};
export default function FileCustom({ src }: propsType): React.JSX.Element {
  const fileName = useMemo(() => src.split("/").pop(), [src]);

  return src ? (
    <Flex justify={"space-between"} align="center">
      <Typography.Link href={`${BASE_URL}api/image?pathFile=${src}`}>
        {fileName}
      </Typography.Link>
    </Flex>
  ) : (
    <></>
  );
}
