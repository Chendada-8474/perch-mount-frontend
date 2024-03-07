import { fetchWithloginCheck } from "./utils/api"

export function getLayers() {
    const url = `http://${import.meta.env.VITE_BACKEND_HOST}/layers/`
    return fetchWithloginCheck(url, "GET")
}