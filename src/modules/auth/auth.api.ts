import { get } from "lodash";
import requester from "~/api/requester";
import { payloadLogin } from "./auth.modal";

const apis = {
    login: (data: payloadLogin) => requester.post(`/api/staff-login`, data),
    getProfile: (token?: string) => requester.get('/api/staff-profile', token),
    validationToken: () => requester.get('/api/valid-token')
  };
export default apis;
