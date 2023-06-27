const domain = "http://localhost:3001"
const apiKey = "c44227f248074d62bed3059005616f3d"
const requestOptions = {
    headers: {
        "Target-URL": "https://rawg.io",
        "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
    }
}

// fetch all the available parent platforms
const parentPlatformsPath = "/api/platforms/lists/parents?key="
let parentPlatforms
let parentPlatformsNamesOrSlugs
fetch(domain + parentPlatformsPath + apiKey, requestOptions)
    .then(resp => resp.json())
    .then(jsonResponse =>  {
        parentPlatforms = jsonResponse.results
        const parentPlatformsNames = parentPlatforms.map(platform => platform.name.toLowerCase())
        const parentPlatformsSlugs = parentPlatforms.map(platform => platform.slug.toLowerCase())
        parentPlatformsNamesOrSlugs = parentPlatformsNames.concat(parentPlatformsSlugs)
    })

function searchParentPlatform(parentPlatformName){
    let parentPlatformId = null
    for (const parentPlatform of parentPlatforms){
        if (parentPlatformName == parentPlatform.name || parentPlatformName == parentPlatform.slug){
            parentPlatformId = parentPlatform.id
        }
    }
    return parentPlatformId
}

function analyzeSearch(searchQuery){
    searchQuery = searchQuery.toLowerCase()
    let searchObject = {}
    for (const platform of parentPlatformsNamesOrSlugs){
        if (searchQuery.includes(platform)){
            searchQuery = searchQuery.replaceAll(platform, "")
            searchObject.platform = searchParentPlatform(platform)
        }
    }
    searchObject.query = searchQuery
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

export function gameHasPlatform(parentPlatformId, gamePlatforms){
    console.log(parentPlatforms)
    for (const parentPlatform of parentPlatforms){
        if (parentPlatform.id == parentPlatformId){
            for (const gamePlatform of gamePlatforms){
                for (const platform of parentPlatform.platforms){
                    if (gamePlatform.platform.id == platform.id){
                        return true
                    }
                }
            }
        }
    }
    return false
    
}
