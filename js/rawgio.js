const domain = "http://localhost:3001"
//const apiKey = "e32eec27801f4816b231d43c3d38528a"
const apiKey = "7dfccf92890d4d62959a27c9bbb07eda"
const requestOptions = {
    headers: {
        "Target-URL": "https://rawg.io",
        "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
    }
}

// fetch all the available parent platforms
const parentPlatformsPath = "/api/platforms/lists/parents?key="

const parentPlatformsPromise = fetch(domain + parentPlatformsPath + apiKey, requestOptions)
    .then(resp => resp.json())
    .then(json => json.results)



const parentPlatformsNamesOrSlugsPromise = parentPlatformsPromise.then(parentPlatforms =>  {
        const parentPlatformsNames = parentPlatforms.map(platform => platform.name.toLowerCase())
        const parentPlatformsSlugs = parentPlatforms.map(platform => platform.slug.toLowerCase())
        return parentPlatformsNames.concat(parentPlatformsSlugs)
    })

async function searchParentPlatform(parentPlatformName){
    const parentPlatforms = await parentPlatformsPromise
    let parentPlatformId = null
    for (const parentPlatform of parentPlatforms){
        if (parentPlatformName == parentPlatform.name || parentPlatformName == parentPlatform.slug){
            parentPlatformId = parentPlatform.id
        }
    }
    return parentPlatformId
}

async function analyzeSearch(searchQuery){
    const parentPlatformsNamesOrSlugs = await parentPlatformsNamesOrSlugsPromise
    searchQuery = searchQuery.toLowerCase()
    let searchObject = {}
    for (const platform of parentPlatformsNamesOrSlugs){
        if (searchQuery.includes(platform)){
            searchQuery = searchQuery.replaceAll(platform, "")
            searchObject.platform = await searchParentPlatform(platform)
        }
    }
    searchObject.query = searchQuery
    return searchObject
}

export async function loadGames(searchQuery){
    let searchQueryObject
    const gamesPath = "/api/games?key="
    let url = domain + gamesPath + apiKey
    if (searchQuery){
        searchQueryObject = await analyzeSearch(searchQuery)
        url += "&search=" + searchQueryObject.query 
        if (searchQueryObject.platform){
            url += "&parent_platforms=" + searchQueryObject.platform

        }
    }
    const responsePromise = fetch(url, requestOptions)
    
    return responsePromise.then(resp => resp.json())
    
}

export async function loadNextPage(nextPageUrl){
    const responsePromise = fetch(nextPageUrl)
    return responsePromise.then(resp => resp.json())
}

// fetch additional game info    
export async function getGameExtraInfo(gameId) {
    const singleGameUrl = domain + "/api/games/" + gameId + "?key=" + apiKey
    const singleGameResponse = await fetch(singleGameUrl, requestOptions)

    // return a promise so it can be handled without blocking the list of cards creation
    return singleGameResponse.json()
}

export async function gameHasPlatform(parentPlatformId, gamePlatformReleases){
    // Find the parent platform object
    const parentPlatforms = await parentPlatformsPromise
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

// fetch game video
export async function getGameVideo(gameId) {
    const singleGameUrl = domain + "/api/games/" + gameId + "/movies" + "?key=" + apiKey
    const singleGameResponse = await fetch(singleGameUrl, requestOptions)
    // return a promise so it can be handled without blocking the page
    return singleGameResponse.json()
}

// fetch game screenshots
export async function getGameScreenshots(gameId) {
    const singleGameUrl = domain + "/api/games/" + gameId + "/screenshots" + "?key=" + apiKey
    const singleGameResponse = await fetch(singleGameUrl, requestOptions)
    // return a promise so it can be handled without blocking the page
    return singleGameResponse.json()
}

export async function thisWeek