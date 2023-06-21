function createGameCards(gamesData){
    for(i = 0; i < gamesData.results.length; i++){
        const gameName = gamesData.results[i].name
        const gameImage = gamesData.results[i].background_image
        const gameReleaseDate = gamesData.results[i].released
        let gameGenres = []
        for (y = 0; y < gamesData.results[i].genres.length; y++){
            gameGenres.push(gamesData.results[i].genres[y].name)
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
    //const cardTemplate = document.getElementById("cardTemplate")
    const newCard = cardTemplate.cloneNode(true)
    newCard.id = "game" + gameCount
    gamesContainer.appendChild(newCard)
    const gameImageElement = document.querySelector(`#${newCard.id} .imageGames`)
    gameImageElement.style = `background-image: url('${gameImage}');`
    const gameTitleElement = document.querySelector(`#${newCard.id} .gameTitle`)
    gameTitleElement.innerHTML = gameName
    const gameRankingElement = document.querySelector(`#${newCard.id} .ranking`)
    gameRankingElement.innerHTML = "#" + (gameCount + 1)
    const gameReleaseDateElement = document.querySelector(`#${newCard.id} .releaseDate`)
    gameReleaseDateElement.innerHTML = gameReleaseDate
    const gameGenresElement = document.querySelector(`#${newCard.id} .genres`)
    gameGenresElement.innerHTML = gameGenres.join(", ")
    newCard.hidden = false
}

addEventListener("DOMContentLoaded", showGames)

