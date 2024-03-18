import { fetchWithloginCheck } from "./utils/api"

export function getMembers() {
    const url = `${window.BACKEND_HOST}/members/`
    return fetchWithloginCheck(url, "GET")
}

export function getMemberByID(memberID) {
    const url = `${window.BACKEND_HOST}/members/${memberID}/`
    return fetchWithloginCheck(url, "GET")
}