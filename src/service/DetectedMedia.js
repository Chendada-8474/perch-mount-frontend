import { fetchWithloginCheck } from "./utils/api"

export function getDetectedMedia(perchMountID = null, sectionID = null, offset = null, limit = null) {

    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/detected_media/`)
    var params = new URLSearchParams()


    if (sectionID != null) {
        params.append("section_id", sectionID)
    }

    if (perchMountID != null) {
        params.append("perch_mount_id", perchMountID)
    }
    if (offset != null) {
        params.append("offset", offset)
    }

    if (limit != null) {
        params.append("limit", limit)
    }

    endPoint.search = params
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function getDetectedMediumByID(detectedMediumID) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/detected_media/${detectedMediumID}/`)
    return fetchWithloginCheck(endPoint.href, "GET")
}

