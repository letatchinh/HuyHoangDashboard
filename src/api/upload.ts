import requester from "./requester"
export default {
    getImage : (path : string) => requester.get(`/api/image?pathFile=${path}`)
}