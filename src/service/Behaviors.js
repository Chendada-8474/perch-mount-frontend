
export function getBehaviors() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/behaviors/`)
        .then((res) => res.json())
        .then((d) => d.behaviors);
}