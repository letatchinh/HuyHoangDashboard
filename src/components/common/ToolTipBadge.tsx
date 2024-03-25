import { Badge, Tooltip, TooltipProps } from 'antd';
import React from 'react';
export default function ToolTipBadge({children,...props}:TooltipProps) : React.JSX.Element {
    return (
        <Tooltip {...props}>
            <Badge {...props?.title && {dot : true}} > 
                {children}
            </Badge>
        </Tooltip>
    )
}