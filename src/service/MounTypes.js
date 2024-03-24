import { fetchWithloginCheck } from "./utils/api"

export function getMountTypes() {
    const url = `${window.BACKEND_HOST}/mount_types/`
    return fetchWithloginCheck(url, "GET")
}
