function createGameCards(gamesData){
    for(i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        const gameName = currentGame.name
        const gameImage = currentGame.background_image
        const gameReleaseDate = currentGame.released
        let gameGenres = []
        for (y = 0; y < currentGame.genres.length; y++){
            gameGenres.push(currentGame.genres[y].name)
        }
        createNewCard(gameName, gameImage, gameReleaseDate, gameGenres, i)
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

function createNewCard(gameName, gameImage, gameReleaseDate, gameGenres, gameCount){
    const newCard = cardTemplate.cloneNode(true)

    // The cloned element needs a new unique id, otherwise, the 'cardTemplate' variable
    // will change from having a single element to having multiple.
    // That will make the handling of this variable harder.
    newCard.id = "game" + gameCount

    gamesContainer.appendChild(newCard)
     
    newCard.querySelector(`.imageGames`).style = `background-image: url('${gameImage}');`
    newCard.querySelector(`.gameTitle`).innerHTML = gameName
    newCard.querySelector(`.ranking`).innerHTML = "#" + (gameCount + 1)
    newCard.querySelector(`.releaseDate`).innerHTML = gameReleaseDate
    newCard.querySelector(`.genres`).innerHTML = gameGenres.join(", ")

    newCard.hidden = false
}

addEventListener("DOMContentLoaded", showGames)

