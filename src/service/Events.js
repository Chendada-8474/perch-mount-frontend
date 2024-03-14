import { fetchWithloginCheck } from "./utils/api"

export function getEvents() {
    const url = `${import.meta.env.VITE_BACKEND_HOST}/events/`
    return fetchWithloginCheck(url, "GET")
}