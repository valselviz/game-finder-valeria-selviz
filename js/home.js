import { loadGames, gameHasPlatform, getGameExtraInfo } from './rawgio.js';

// List of parent platform ID
const pcId = 1
const playstationId = 2
const xboxId = 3
const nintendoId = 7

// array of games fetched from rawg API
let games


function createGameCards(gamesData){
    for(let i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        createNewCard(currentGame, i)
    }
}

async function showGames(searchQuery){
    const gamesResponse = await loadGames(searchQuery)
    games = gamesResponse.results
    createGameCards(gamesResponse)
}

function createNewCard(game, gameCount){
    const newCard = cardTemplate.cloneNode(true)

    // The cloned element needs a new unique id, otherwise, the 'cardTemplate' variable
    // will change from having a single element to having multiple.
    // That will make the handling of this variable harder.
    newCard.id = "game" + gameCount

    gamesContainer.appendChild(newCard)

    newCard.onclick = (event) => openFloatingCard(event, game)
     
    newCard.querySelector(`.gameImage`).style = `background-image: url('${game.background_image}');`
    newCard.querySelector(`.gameTitle`).innerHTML = game.name
    newCard.querySelector(`.ranking`).innerHTML = "#" + (gameCount + 1)
    newCard.querySelector(`.releaseDate`).innerHTML = game.released

    // use the 'map' function to convert a array of genre objects, into 
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

function openFloatingCard(event, game){
    // I need to stop the propagation of this event
    // Otherwise, the function that closes the floating card will executed immediately after this function
    // Because that function is execution when a click happens
    event.stopPropagation()
    floatingCardContainer.style = ""

    const backgroundImageStyle = `background-image: linear-gradient(to bottom, #00000000, #303030FF), url("${game.background_image}")`
    floatingCardContainer.querySelector(`.floatingCard`).style = backgroundImageStyle
    floatingCardContainer.querySelector(`.gameTitle`).innerHTML = game.name
    floatingCardContainer.querySelector(`.ranking`).innerHTML = "#" + (gameCount + 1)
    floatingCardContainer.querySelector(`.releaseDate`).innerHTML = game.released
}

// Close the floating card when clicking anywhere
addEventListener("click", e => {
    console.log(floatingCardContainer.style.display)
    if (floatingCardContainer.style.display == "") {
        floatingCardContainer.style = "display: none;"
    }
})
