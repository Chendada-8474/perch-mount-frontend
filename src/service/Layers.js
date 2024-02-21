
export function getLayers() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/layers/`)
        .then((res) => res.json())
        .then((d) => d);
}