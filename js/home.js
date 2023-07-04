import { loadGames, gameHasPlatform, getGameExtraInfo, getGameVideo } from './rawgio.js';

// List of parent platform ID
const pcId = 1
const playstationId = 2
const xboxId = 3
const nintendoId = 7

// array of games fetched from rawg API
let games

// array of additional game details fetched individually from rawg API
const gameDetails = []

function parseDate(dateStrig) {
    const date = new Date(dateStrig)
    return `${date.toLocaleString('en-US', {month: 'short'})} ${date.getDate()}, ${date.getFullYear()}`
}

function createGameCards(gamesData){
    for(let i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        createNewCard(currentGame, i)
    }
}

async function showGames(searchQuery){
    const gamesResponse = await loadGames(searchQuery)
    games = gamesResponse.results
    console.log(games)
    createGameCards(gamesResponse)
}

function createNewCard(game, gameCount){
    const newCard = cardTemplate.cloneNode(true)

    // The cloned element needs a new unique id, otherwise, the 'cardTemplate' variable
    // will change from having a single element to having multiple.
    // That will make the handling of this variable harder.
    newCard.id = "game" + gameCount

    gamesContainer.appendChild(newCard)

    newCard.onclick = (event) => openFloatingCard(event, game, gameCount)
     
    newCard.querySelector(`.gameImage`).style = `background-image: url('${game.background_image}');`
    newCard.querySelector(`.gameTitle`).innerHTML = game.name
    newCard.querySelector(`.ranking`).innerHTML = "#" + (gameCount + 1)
    newCard.querySelector(`.releaseDate`).innerHTML = parseDate(game.released)

    // use the 'map' function to convert an array of genre objects, into 
    // an array of genre names (strings)
    const genreNames = game.genres.map(genre => genre.name)
    newCard.querySelector(`.genres`).innerHTML = genreNames.join(", ")

    if (!gameHasPlatform(pcId, game.platforms)){
        newCard.querySelector(`.pcIcon`).hidden = true
    }
    if (!gameHasPlatform(playstationId, game.platforms)){
        newCard.querySelector(`.playstationIcon`).hidden = true
    }
    if (!gameHasPlatform(xboxId, game.platforms)){
        newCard.querySelector(`.xboxIcon`).hidden = true
    }
    if (!gameHasPlatform(nintendoId, game.platforms)){
        newCard.querySelector(`.nintendoIcon`).hidden = true
    }

    const extraInfoPromise = getGameExtraInfo(game.id)
    extraInfoPromise.then(extraInfo => {
        gameDetails[gameCount] = extraInfo
        newCard.querySelector(`.descriptionText`).innerHTML = extraInfo.description
    })

    newCard.hidden = false
}

addEventListener("DOMContentLoaded", e => showGames())

searchInput.addEventListener("change", refreshGamesWithSearchCriteria);

function refreshGamesWithSearchCriteria() {
    // we need to remove all games to show the searched games only
    gamesContainer.innerHTML = ""
    let search = searchInput.value;
    showGames(search)
}

function changeCardsDisplay(containerClass) {
    gamesContainer.className = containerClass
    if (containerClass == "threeColumnsView") {
        threeColumnsIcon.src = "assets/cardsDisplay/threeColumnViewActive.svg"
        singleColumnIcon.src = "assets/cardsDisplay/singleColumnViewDisabled.svg"
        for (const description of gamesContainer.querySelectorAll(`.description`)){
            description.hidden = true
        }
    } else {
        threeColumnsIcon.src = "assets/cardsDisplay/threeColumnViewDisabled.svg"
        singleColumnIcon.src = "assets/cardsDisplay/singleColumnViewActive.svg"
        console.log(gamesContainer.querySelectorAll(`.description`))
        for (const description of gamesContainer.querySelectorAll(`.description`)){
            description.hidden = false
        }
    }
}

threeColumnsIcon.addEventListener("click", () => changeCardsDisplay("threeColumnsView"))
singleColumnIcon.addEventListener("click", () => changeCardsDisplay("singleColumnView"))

function openFloatingCard(event, game, gameCount){
    // I need to stop the propagation of this event
    // Otherwise, the function that closes the floating card will executed immediately after this function
    // Because that function is execution when a click happens
    event.stopPropagation()
    floatingCardContainer.style = ""

    const backgroundImageStyle = `background-image: linear-gradient(to bottom, #00000000, #303030FF), url("${game.background_image}")`
    floatingCardContainer.querySelector(`.floatingCard`).style = backgroundImageStyle
    floatingCardContainer.querySelector(`.gameTitle`).innerHTML = game.name
    floatingCardContainer.querySelector(`.rankingTag .purpleText`).innerHTML = "#" + (gameCount + 1)
    floatingCardContainer.querySelector(`.dateReleaseTag .grayText`).innerHTML = game.released
    floatingCardContainer.querySelector(`.descriptionText`).innerHTML = gameDetails[gameCount].description

    // use the 'map' function to convert an array of parent platforms objects, into 
    // an array of platform names (strings)
    const platformNames = game.parent_platforms.map(parentPlatform => parentPlatform.platform.name)
    floatingCardContainer.querySelector(`.platformsText`).innerHTML = platformNames.join(", ")

    floatingCardContainer.querySelector(`.dateReleaseTag .grayText`).innerHTML = parseDate(game.released)
    floatingCardContainer.querySelector(`.releaseDate`).innerHTML = parseDate(game.released)
    floatingCardContainer.querySelector(`.publisher`).innerHTML = gameDetails[gameCount].publishers[0].name
    floatingCardContainer.querySelector(`.website`).href = gameDetails[gameCount].website
    floatingCardContainer.querySelector(`.website`).innerHTML = gameDetails[gameCount].website
    floatingCardContainer.querySelector(`.developer`).innerHTML = gameDetails[gameCount].developers[0].name
    floatingCardContainer.querySelector(`.ageRating`).innerHTML = gameDetails[gameCount].esrb_rating.name

    

    // use the 'map' function to convert an array of genre objects, into 
    // an array of genre names (strings)
    const genreNames = game.genres.map(genre => genre.name)
    floatingCardContainer.querySelector(`.genres`).innerHTML = genreNames.join(", ")

    const videoPromise = getGameVideo(game.id)
    videoPromise.then(videoJson => {
        floatingCardContainer.querySelector(`video`).src = videoJson.results.length > 0 ? 
            videoJson.results[0].data[480] : null
    })
}

// Close the floating card when clicking anywhere
addEventListener("click", e => {
    console.log(floatingCardContainer.style.display)
    if (floatingCardContainer.style.display == "") {
        floatingCardContainer.style = "display: none;"
    }
})
