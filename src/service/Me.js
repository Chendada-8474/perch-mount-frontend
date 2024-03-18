import { fetchWithloginCheck } from "./utils/api"

export function me() {
    var endPoint = new URL(`${window.BACKEND_HOST}/me`)
    return fetchWithloginCheck(endPoint, "GET")
}