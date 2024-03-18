import { fetchWithloginCheck } from "./utils/api"

export function getHabitats() {
    const url = `${window.BACKEND_HOST}/habitats/`
    return fetchWithloginCheck(url, "GET")
}