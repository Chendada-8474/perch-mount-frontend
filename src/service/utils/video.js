export function getVideoEndpoint(base64Path) {
    return `${import.meta.env.VITE_VIDEO_HOST}/${base64Path}`
}