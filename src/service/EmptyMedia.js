
export function getEmptyMedia(perchMountID = null, sectionID = null, offset = null, limit = null) {

    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/empty_media`)
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
    return fetch(endPoint.href)
        .then((res) => res.json())
        .then((d) => d);
}