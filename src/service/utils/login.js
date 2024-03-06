export function loginRequest(username, phonenumber) {
    var endPoint = new URL(`http://${import.meta.env.VITE_BACKEND_HOST}/login`)
    return fetch(endPoint.href, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            username: username,
            phone_number: phonenumber,
        }),
        headers: {
            "content-type": "application/json",
        },
    }).then((res) => {

        if (res.ok) {
            return res.json()
        }

        return res.text().then(errorMsg => {
            throw new Error(errorMsg);
        });
    })
        .then((d) => d)
}