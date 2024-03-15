import { get } from 'lodash';
import React, { useMemo } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useGetSalesGroup } from '../../salesGroup.hook';
import CardLead from './CardLead';
const StyledNode = ({children} : any) => children

type propsType = {
    id? : string
}
export default function Relationship({id}:propsType) : React.JSX.Element {
    const [salesGroup, isLoading] = useGetSalesGroup(id);
    const child = useMemo(() => get(salesGroup,'children',[]),[salesGroup])
    return (
        <Tree
        lineWidth={'2px'}
        lineColor={'green'}
        lineBorderRadius={'10px'}
        label={<CardLead />}
      >
        <TreeNode label={<StyledNode>Child 1</StyledNode>}>
          <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
        </TreeNode>
        <TreeNode label={<StyledNode>Child 2</StyledNode>}>
          <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
            <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
            <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
          </TreeNode>
        </TreeNode>
        <TreeNode label={<StyledNode>Child 3</StyledNode>}>
          <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
          <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
        </TreeNode>
      </Tree>
    )
}