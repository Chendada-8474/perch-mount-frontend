
export function getProjects() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/projects/`)
        .then((res) => res.json())
        .then((d) => d);
}