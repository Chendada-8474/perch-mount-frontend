import { fetchWithloginCheck } from "../utils/api"

export function shiftSectionTime(sectionID, newStartTime) {
    var endPoint = new URL(`${window.BACKEND_HOST}/shift_time/`)
    var params = new URLSearchParams()
    params.append('section_id', sectionID)
    params.append('new_start_time', newStartTime)
    endPoint.search = params
    return fetchWithloginCheck(endPoint, "PATCH")
}
