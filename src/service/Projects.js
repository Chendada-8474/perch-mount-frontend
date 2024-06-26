import { fetchWithloginCheck } from "./utils/api"

export function getProjects() {
    return fetchWithloginCheck(`${window.BACKEND_HOST}/projects/`, "GET")
}

export function getProjectByID(projectID) {
    return fetchWithloginCheck(`${window.BACKEND_HOST}/projects/${projectID}/`, "GET")
}

export function addProject(name) {
    return fetchWithloginCheck(`${window.BACKEND_HOST}/projects/`, "POST", { name: name })
}