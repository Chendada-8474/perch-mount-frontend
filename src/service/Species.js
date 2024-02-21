
export function getSpecies() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/species/`)
        .then((res) => res.json())
        .then((d) => d);
}