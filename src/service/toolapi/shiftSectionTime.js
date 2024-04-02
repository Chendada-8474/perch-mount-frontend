import { fetchWithloginCheck } from "./utils/api"

export function shiftSectionTime(sectionID, newStartTime) {
    const url = `${window.BACKEND_HOST}/shift_time?section_id=${sectionID}&new_start_time=${newStartTime}`
    return fetchWithloginCheck(url, "PATCH")
}
