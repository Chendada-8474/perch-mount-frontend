import { fetchWithloginCheck } from "./utils/api"

export function getCameras() {
    const url = `${window.BACKEND_HOST}/cameras/`
    return fetchWithloginCheck(url, "GET")

}


export function addCamera(data) {
    const url = `${window.BACKEND_HOST}/cameras/`
    return fetchWithloginCheck(url, "POST", data)
}