
export function getEvents() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/events/`)
        .then((res) => res.json())
        .then((d) => d);
}