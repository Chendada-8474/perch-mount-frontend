import { fetchWithloginCheck } from "./utils/api"

export function getProjects() {
    return fetchWithloginCheck(`http://${import.meta.env.VITE_BACKEND_HOST}/projects/`, "GET")
}



export function getProjectByID(projectID) {
    return fetchWithloginCheck(`http://${import.meta.env.VITE_BACKEND_HOST}/projects/${projectID}/`, "GET")
}