export function getPerchMounts(project = null, habitat = null, terminated = null, claim_by = null) {

    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/perch_mounts`)
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
    return fetch(endPoint.href)
        .then((res) => res.json())
        .then((d) => d);
}

export function getPerchMountByID(perchMountID) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/perch_mounts/${perchMountID}`)

    return fetch(endPoint.href)
        .then((res) => res.json())
        .then((d) => d);
}