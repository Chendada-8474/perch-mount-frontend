
export function getMembers() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/members/`)
        .then((res) => res.json())
        .then((d) => d);
}