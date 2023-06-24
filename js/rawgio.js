const domain = "http://localhost:3000"
const apiKey = "c44227f248074d62bed3059005616f3d"
const requestOptions = {
    headers: {
        "Target-URL": "https://rawg.io",
        "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
    }
}

// fetch all the available platforms
const parentPlatformsPath = "/api/platforms/lists/parents?key="
let parentPlatforms
fetch(domain + parentPlatformsPath + apiKey, requestOptions)
    .then(resp => resp.json())
    .then(jsonResponse =>  {
        parentPlatforms = jsonResponse.results
        console.log(parentPlatforms)
    })

export function loadGames(){
    const path = "/api/games?key="
    const responsePromise = fetch(domain + path + apiKey, requestOptions)
    
    return responsePromise.then(resp => resp.json())
    
}

