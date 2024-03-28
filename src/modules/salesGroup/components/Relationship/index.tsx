import { get } from 'lodash';
import React, { useMemo } from 'react';
import { Tree } from 'react-organizational-chart';
import { useGetSalesGroup } from '../../salesGroup.hook';
import { getDeepChild, RulesLeader, RulesMember } from '../../salesGroup.service';
import CardRelation from './CardRelation';
const RulesLeaderMethod = new RulesLeader();
const RulesMemberMethod = new RulesMember();

type propsType = {
    id? : string
}
export default function Relationship({id}:propsType) : React.JSX.Element {
    const [salesGroup, isLoading] = useGetSalesGroup(id);
    const child = useMemo(() => get(salesGroup,'children',[]),[salesGroup]);
    const leader = useMemo(() => RulesLeaderMethod.FindOne(get(salesGroup,'salesGroupPermission',[])),[salesGroup]);
    const member = useMemo(() => RulesMemberMethod.FindAll(get(salesGroup,'salesGroupPermission',[])),[salesGroup]);
    if(isLoading){
        return <div>Loading...</div>
    }
    return (
        <Tree
        lineWidth={'2px'}
        lineColor={'#3481ff'}
        lineBorderRadius={'10px'}
        label={<CardRelation typeArea={get(salesGroup,'typeArea')}  name={get(salesGroup,'name')} member={member} leader={leader} managementArea={get(salesGroup,'managementArea',[])}/>}
      >
        {getDeepChild(child)}
      </Tree>
    )
}