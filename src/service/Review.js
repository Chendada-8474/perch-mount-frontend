import { fetchWithloginCheck } from "./utils/api"


export function review(media) {
    var endPoint = new URL(`${import.meta.env.VITE_BACKEND_HOST}/media/`)
    return fetchWithloginCheck(endPoint.href, "PUT", { media: media })
}