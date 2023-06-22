function createGameCards(gamesData){
    for(i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        createNewCard(currentGame, i)
    }
}

function showGames(){
    const requestOptions = {
        headers: {
            "Target-URL": "https://rawg.io",
            "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
        }
    }
    const responsePromise = fetch("http://localhost:3000/api/games?key=c44227f248074d62bed3059005616f3d", requestOptions)
    
    const jsonPromise = responsePromise.then(resp => resp.json())
    
    jsonPromise.then(createGameCards)
    
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

    newCard.hidden = false
}

addEventListener("DOMContentLoaded", showGames)

