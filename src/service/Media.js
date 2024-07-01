import { fetchWithloginCheck } from "./utils/api"

export function getMedia(perchMountID = null, sectionID = null, offset = null, limit = null) {

    var endPoint = new URL(`${window.BACKEND_HOST}/media/`)
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

export function getMediaByFeature(
    taxonOrder = null,
    perchMountID = null,
    featureBehavior = null,
    featureBy = null,
    from = null,
    to = null,
    offset = 0,
    limit = 50,
) {

    var endPoint = new URL(`${window.BACKEND_HOST}/media/`)
    var params = new URLSearchParams()

    params.append("limit", limit)
    params.append("offset", offset)

    if (taxonOrder != null) {
        params.append("taxon_order", taxonOrder)
    }

    if (perchMountID != null) {
        params.append("perch_mount_id", perchMountID)
    }

    if (from != null) {
        params.append("start_time", from)
    }

    if (to != null) {
        params.append("end_time", to)
    }

    if (featureBehavior != null) {
        params.append("feature_behavior", featureBehavior)
    }

    if (featureBehavior != null) {
        params.append("feature_behavior", featureBehavior)
    }

    if (featureBy != null) {
        params.append("feature_by", featureBy)
    }
    endPoint.search = params
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function getMediumByID(mediumID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/media/${mediumID}/`)
    return fetchWithloginCheck(endPoint.href, "GET")
}