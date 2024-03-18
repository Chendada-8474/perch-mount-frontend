import { fetchWithloginCheck } from "./utils/api"

export function getBehaviors() {
    const url = `${window.BACKEND_HOST}/behaviors/`
    return fetchWithloginCheck(url, "GET")
}