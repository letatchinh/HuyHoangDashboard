export const service = {
    
}
export const convertInitContract = (contract : any) => {
  return {
    ...contract,
  }
  };
export const convertSubmitData = (values : any) => {
    const submitData = {
      ...values,
    };

    return submitData;
}