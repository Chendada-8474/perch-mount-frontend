import { fetchWithloginCheck } from "./utils/api"

export function getPerchMounts(project = null, habitat = null, terminated = null, claim_by = null) {

    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/`)
    var params = new URLSearchParams()

    if (project != null) {
        params.append("project", project)
    }
    if (habitat != null) {
        params.append("habitat", habitat)
    }
    if (terminated != null) {
        params.append("terminated", terminated)
    }
    if (claim_by != null) {
        params.append("claim_by", claim_by)
    }

    endPoint.search = params
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function getPerchMountByID(perchMountID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/`)
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function updatePerchMountByID(perchMountID, data) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/`)
    return fetchWithloginCheck(endPoint.href, "PATCH", data)
}

export function addPerchMount(data) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/`)
    return fetchWithloginCheck(endPoint.href, "POST", data)
}

export function getMediaCount(perchMountID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/media_count`)
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function getPerchMountPending() {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/pending`)
    return fetchWithloginCheck(endPoint.href, "GET")
}