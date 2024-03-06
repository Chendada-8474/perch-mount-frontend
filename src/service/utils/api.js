
export function fetchWithloginCheck(endPoint, method, data) {
    return fetch(endPoint, {
        method: method,
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
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