import { fetchWithloginCheck } from "./utils/api"

export function getCameras() {
    const url = `http://${import.meta.env.VITE_BACKEND_HOST}/cameras/`
    return fetchWithloginCheck(url, "GET")

}