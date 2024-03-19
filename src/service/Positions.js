import { fetchWithloginCheck } from "./utils/api"

export function getPositions() {
    return fetchWithloginCheck(`${window.BACKEND_HOST}/positions/`, "GET")
}


