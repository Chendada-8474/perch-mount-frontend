export function loginRequest(username, phonenumber) {
    var endPoint = new URL(`${window.BACKEND_HOST}/login`)
    return fetch(endPoint.href, {
        method: "POST",
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
        .then(d => {
            window.localStorage.setItem("token", d.token)
        })
}


export function signOut() {
    var endPoint = new URL(`${import.meta.env.VITE_BACKEND_HOST}/logout`)
    return fetch(endPoint.href, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${window.localStorage.getItem("token")}`
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