import { fetchWithloginCheck } from "./utils/api"


export function emptyCheck(media) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/empty_media/`)

    return fetchWithloginCheck(endPoint.href, "PUT", media)
}