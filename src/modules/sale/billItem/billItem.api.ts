import requester from "~/api/requester";
import { PayloadSubmitUpdateBillItem } from "./billItem.modal";

const apis = {
    update: (data?: PayloadSubmitUpdateBillItem) => requester.put(`/api/v1/update-billItems`, data),
}
export default apis;
