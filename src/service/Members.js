import { fetchWithloginCheck } from "./utils/api"

export function getMembers() {
    const url = `${window.BACKEND_HOST}/members/`
    return fetchWithloginCheck(url, "GET")
}

export function getMemberByID(memberID) {
    const url = `${window.BACKEND_HOST}/members/${memberID}/`
    return fetchWithloginCheck(url, "GET")
}

export function addMember(data) {
    var endPoint = new URL(`${window.BACKEND_HOST}/members/`)
    return fetchWithloginCheck(endPoint.href, "POST", data)
}