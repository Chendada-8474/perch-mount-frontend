import { fetchWithloginCheck } from "./utils/api"


export function review(media) {
    var endPoint = new URL(`${window.BACKEND_HOST}/media/`)
    return fetchWithloginCheck(endPoint.href, "PUT", { media: media })
}