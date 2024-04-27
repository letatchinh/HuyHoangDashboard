import requester from "~/api/requester";

const importExcel = {
  postFile: (files: any) =>
    requester.postFormData("/api/v1/import-pharma", files),
};
export default importExcel;
