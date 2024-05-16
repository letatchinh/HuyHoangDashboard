import { Typography } from 'antd';
import React, { useState } from 'react';
type propsType = {
    children : any
}
export default function ContentEllipsis({children}:propsType) : React.JSX.Element {
    const [expanded, setExpanded] = useState(false);

    return (
        <Typography.Paragraph ellipsis={{
            rows : 5,
            expandable : 'collapsible',
            expanded,
            onExpand: (_, info) => setExpanded(info.expanded),
            symbol : expanded ? "Rút gọn" : "Mở rộng"
          }}>
            {children}
          </Typography.Paragraph>
    )
}