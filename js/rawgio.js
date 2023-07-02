const domain = "http://localhost:3001"
const apiKey = "ddf1a2292c5542dfae05ca0500357de7"
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

// fetch additional game info    
export async function getGameExtraInfo(gameId) {
    const singleGameUrl = domain + "/api/games/" + gameId + "?key=" + apiKey
    const singleGameResponse = await fetch(singleGameUrl, requestOptions)

    // return a promise so it can be handled without blocking the list of cards creation
    return singleGameResponse.json()
}

export function gameHasPlatform(parentPlatformId, gamePlatformReleases){
    // Find the parent platform object
    let parentPlatform
    for (const currentParentPlatform of parentPlatforms){
        if (currentParentPlatform.id == parentPlatformId){
            parentPlatform = currentParentPlatform
        }
    }
    // Compares the platforms of the game with the platforms of the parent platform
    // Return true is there is a match
    for (const gamePlatformRelease of gamePlatformReleases){
        for (const platform of parentPlatform.platforms){
            if (gamePlatformRelease.platform.id == platform.id){
                return true
            }
        }
    }
    return false
    
}
