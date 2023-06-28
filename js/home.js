import { loadGames, gameHasPlatform } from './rawgio.js';

// List of parent platform ID
const pcId = 1
const playstationId = 2
const xboxId = 3
const nintendoId = 7

function createGameCards(gamesData){
    for(let i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        createNewCard(currentGame, i)
    }
}

async function showGames(searchQuery){
    const gamesResponse = await loadGames(searchQuery)
    createGameCards(gamesResponse)
}

function createNewCard(game, gameCount){
    const newCard = cardTemplate.cloneNode(true)

    // The cloned element needs a new unique id, otherwise, the 'cardTemplate' variable
    // will change from having a single element to having multiple.
    // That will make the handling of this variable harder.
    newCard.id = "game" + gameCount

    gamesContainer.appendChild(newCard)
     
    newCard.querySelector(`.imageGames`).style = `background-image: url('${game.background_image}');`
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

