export function checkAccessToken() {
    const cookiesArray = document.cookie.split("; ")
    let hasAccessToken = false
    for (const singleCookie of cookiesArray) {
        const cookieName = singleCookie.split("=")[0]
        const cookieValue = singleCookie.split("=")[1]
        if (cookieName == "accessToken" && cookieValue){
            hasAccessToken = true
        }
    }
    if (!hasAccessToken) {
        window.location.replace("/index.html")
    }
}

export function eraseAccessToken() {
    // Set an empty value in the accessToken cookie
    document.cookie = "accessToken="

    //console.log(document.cookie)
    /*const cookiesArray = document.cookie.split("; ")
    for (const singleCookie of cookiesArray) {
        const cookieName = singleCookie.split("=")[0]
        if (cookieName == "accessToken"){
            console.log(document.cookie.replace(singleCookie + "; ", ""))
            document.cookie = document.cookie.replace(singleCookie + "; ", "")
        }
    }*/
    //console.log(document.cookie)
    checkAccessToken()
}