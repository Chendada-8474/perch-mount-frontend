import { fetchWithloginCheck } from "./utils/api"

export function getMembers() {
    const url = `${import.meta.env.VITE_BACKEND_HOST}/members/`
    return fetchWithloginCheck(url, "GET")
}