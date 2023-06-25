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
let parentPlatformsNames
fetch(domain + parentPlatformsPath + apiKey, requestOptions)
    .then(resp => resp.json())
    .then(jsonResponse =>  {
        parentPlatforms = jsonResponse.results
        parentPlatformsNames = parentPlatforms.map(platform => platform.name)
    })



function searchPlatforms(searchPlatform){
    let platformId = null
    for (const platform of parentPlatforms){
        if (searchPlatform == platform.name || searchPlatform == platform.slug){
            platformId = platform.id
        }
    }
    return platformId
}

function analyzeSearch(searchQuery){
    let searchObject = {}
    for (const platform of parentPlatformsNames){
        if (searchQuery.includes(platform)){
            searchQuery = searchQuery.replaceAll(platform, "")
            searchObject.query = searchQuery
            searchObject.platform = searchPlatforms(platform)
        }
        else {
            searchObject.query = searchQuery
        }
    }
    return searchObject
}

export function loadGames(searchQuery){
    let searchQueryObject
    const gamesPath = "/api/games?key="
    let url = domain + gamesPath + apiKey
    if (searchQuery){
        searchQueryObject = analyzeSearch(searchQuery)
        url += "&search=" + searchQueryObject.query 
        if (searchQueryObject.platform){
            url += "&parent_platforms=" + searchQueryObject.platform
            
        }
    }
    console.log({url})
    console.log(searchQueryObject)
    const responsePromise = fetch(url, requestOptions)
    
    return responsePromise.then(resp => resp.json())
    
}

