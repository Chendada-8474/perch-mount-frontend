
export function getHabitats() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/habitats/`)
        .then((res) => res.json())
        .then((d) => d);
}