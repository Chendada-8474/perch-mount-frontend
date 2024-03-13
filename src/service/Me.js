import { fetchWithloginCheck } from "./utils/api"

export function me() {
    var endPoint = new URL(`${import.meta.env.VITE_BACKEND_HOST}/me`)
    return fetchWithloginCheck(endPoint, "GET")
}