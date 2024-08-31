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

export function claimPerchMount(perchMountID, memberID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/`)
    return fetchWithloginCheck(endPoint.href, "PATCH", { claim_by: memberID })
}

export function cancelClaimPerchMount(perchMountID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/`)
    return fetchWithloginCheck(endPoint.href, "PATCH", { claim_by: null })
}


export function getMonthlyPendingByPerchMountID(perchMountID) {
    var endPoint = new URL(`${window.BACKEND_HOST}/perch_mounts/${perchMountID}/monthly_pending/`)
    var counts = fetchWithloginCheck(endPoint.href, "GET")
    return fetchWithloginCheck(endPoint.href, "GET")
}

function yearMonth(year, month) {
    return year * 100 + month
}

export function mergeCountTables(emptyCounts, detectedCounts, compeletedCounts) {
    var monthYearMap = {}

    for (const counts of [emptyCounts, detectedCounts, compeletedCounts]) {

        for (const count of counts) {
            monthYearMap[yearMonth(count.year, count.month)] = {
                emptyCounts: 0,
                detectedCounts: 0,
                compeletedCounts: 0,
                year: count.year,
                month: count.month,
            }
        }
    }

    for (const count of emptyCounts) {
        var ym = yearMonth(count.year, count.month)
        monthYearMap[ym].emptyCounts = count.count

    }
    for (const count of detectedCounts) {
        var ym = yearMonth(count.year, count.month)
        monthYearMap[ym].detectedCounts = count.count
    }
    for (const count of compeletedCounts) {
        var ym = yearMonth(count.year, count.month)
        monthYearMap[ym].compeletedCounts = count.count
    }

    var counts = []

    for (const [k, v] of Object.entries(monthYearMap)) {
        v.yearMonth = k
        counts.push(v)
    }

    counts.sort(function (a, b) {
        return a - b
    });

    return counts
}

