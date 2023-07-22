export function checkAccessToken() {
    const cookiesArray = document.cookie.split("; ")
    const hasAccessToken = false
    for (const singleCookie of cookiesArray) {
        const cookieName = singleCookie.split("=")[0]
        if (cookieName == "accessToken"){
            hasAccessToken = true
        }
    }
    if (!hasAccessToken) {
        window.location.replace("/index.html")
    }
}