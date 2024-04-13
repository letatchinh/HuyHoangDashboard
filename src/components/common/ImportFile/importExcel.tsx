import requester from "~/api/requester";

const importExcel = {
    postFile: (file: any) =>
      requester.post('/api/v1/import-pharma', file)
  };
  export default importExcel;