export const service = {
    
}
export const convertInitContract = (contract: any) => {
  return {
    ...contract,
  }
  };
export const convertSubmitData = (values : any) => {
    const submitData = {
      ...values,
      files: values?.files?.fileList?.map((item: any) => ({
        url: item?.response?.url,
        name: item.name
      }))
    };

    return submitData;
}