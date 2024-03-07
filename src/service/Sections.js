import { fetchWithloginCheck } from "./utils/api"

export function getSections(perchMount = null, checkDateFrom = null, checkDateTo = null, valid = null, operator = null) {

    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/sections/`)
    var params = new URLSearchParams()

    if (perchMount != null) {
        params.append("perch_mount", perchMount)
    }
    if (checkDateFrom != null) {
        params.append("check_date_from", checkDateFrom)
    }
    if (checkDateTo != null) {
        params.append("check_date_to", checkDateTo)
    }
    if (valid != null) {
        params.append("valid", valid)
    }
    if (operator != null) {
        params.append("operator", operator)
    }

    endPoint.search = params
    return fetchWithloginCheck(endPoint.href, "GET")
}

export function getSectionByID(sectionID) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/sections/${sectionID}/`)
    return fetchWithloginCheck(endPoint.href, "GET")
}