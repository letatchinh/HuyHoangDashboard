import requester from "~/api/requester";
import { payloadLogin } from "./auth.modal";
const apis = {
  login: (data: payloadLogin) => requester.post(`/api/v1/staff-login`, data),
  getProfile: (token?:string) => requester.get('/api/v1/staff-profile', token)

};
export default apis;
