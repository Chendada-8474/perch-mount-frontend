import { fetchWithloginCheck } from "./utils/api"


export function emptyCheck(media) {
    var endPoint = new URL(`${window.BACKEND_HOST}/empty_media/`)

    return fetchWithloginCheck(endPoint.href, "PUT", media)
}