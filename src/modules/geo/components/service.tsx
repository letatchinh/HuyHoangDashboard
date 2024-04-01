
const duplicates = (array:any[]) => array.filter((item, index) => array.indexOf(item) !== index);

export const compareBlackList_Parent = (blackList:any[],parentList:any[]) => {
    const blackListDuplicate = duplicates(blackList);
    
    let keyRemoved : any[] = [];
    const newParentList = parentList?.filter((item:any) => !blackListDuplicate.includes(item));
    const newBlackList = blackList?.filter((item:any) => {
        let s = true;
        if(blackListDuplicate.includes(item)){
            if(!keyRemoved.includes(item)){
                keyRemoved.push(item);
                s = false;
            }
        }
        return s;
    });
    return {
        newParentList,
        newBlackList
    }
}