
export function fetchWithloginCheck(endPoint, method, data) {

    const token = window.localStorage.getItem("token")

    if (!token) {
        window.location.replace("/#/auth/login")
    }

    return fetch(endPoint, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
        .then((res) => {

            if (res.ok) {
                return res.json()
            }
            if (res.status == 401) {
                window.location.replace("/#/auth/login")
            }

            return res.text().then(errorMsg => {
                throw new Error(errorMsg);
            });
        })
        .then((d) => d)
}