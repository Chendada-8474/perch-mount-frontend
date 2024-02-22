
export function getProjects() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/projects/`)
        .then((res) => res.json())
        .then((d) => d);
}



export function getProjectByID(projectID) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/projects/${projectID}`)

    return fetch(endPoint.href)
        .then((res) => res.json())
        .then((d) => d);
}