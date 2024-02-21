
export function getCameras() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/cameras/`)
        .then((res) => res.json())
        .then((d) => d.cameras);
}