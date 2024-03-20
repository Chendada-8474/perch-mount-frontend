import { fetchWithloginCheck } from "./utils/api"

export function getEvents() {
    const url = `${window.BACKEND_HOST}/events/`
    return fetchWithloginCheck(url, "GET")
}

export function addEvent(data) {
    const url = `${window.BACKEND_HOST}/events/`
    return fetchWithloginCheck(url, "POST", data)
}