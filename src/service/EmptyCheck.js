export function emptyCheck(media) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/empty_media/`)
    return fetch(endPoint.href, {
        method: "PUT",
        body: JSON.stringify(media),
        headers: { "content-type": "application/json" },
    })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            return res.text().then(errorMsg => {
                throw new Error(errorMsg);
            });
        })
        .then((d) => d)
}