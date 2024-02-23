import requester from "~/api/requester";
import { PayloadSubmitUpdateOrderItem } from "./orderItem.modal";
import { get } from "lodash";

const apis = {
    update: (data?: PayloadSubmitUpdateOrderItem) => requester.put(`/api/v1/order-supplier-item-update`, data),
}
export default apis;
