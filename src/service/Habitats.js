import { fetchWithloginCheck } from "./utils/api"

export function getHabitats() {
    const url = `${import.meta.env.VITE_BACKEND_HOST}/habitats/`
    return fetchWithloginCheck(url, "GET")
}