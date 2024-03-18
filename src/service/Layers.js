import { fetchWithloginCheck } from "./utils/api"

export function getLayers() {
    const url = `${window.BACKEND_HOST}/layers/`
    return fetchWithloginCheck(url, "GET")
}