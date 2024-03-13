import { fetchWithloginCheck } from "./utils/api"

export function getBehaviors() {
    const url = `${import.meta.env.VITE_BACKEND_HOST}/behaviors/`
    return fetchWithloginCheck(url, "GET")
}