

import SkeletonInput from "antd/es/skeleton/Input";
import React from "react";
const RenderLoading = (loading:boolean,children:React.JSX.Element) => loading ? <SkeletonInput /> : children;

export default RenderLoading