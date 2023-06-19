/*const requestOptions = {
    headers: {
        "Target-URL": "https://rawg.io",
        "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
    }
}
const responsePromise = fetch("http://localhost:3000/api/games?key=c44227f248074d62bed3059005616f3d", requestOptions)

const jsonPromise = responsePromise.then(resp => resp.json())
console.log(jsonPromise)

jsonPromise.then(json => console.log(json))*/

function createNewCard(){
    //const cardTemplate = document.getElementById("cardTemplate")
    console.log(cardTemplate)
    const newCard = cardTemplate.cloneNode(true)
    newCard.id = "game0"
    console.log(gamesContainer)
    gamesContainer.appendChild(newCard)
    const gameTitleElement = document.querySelector("#game0 .gameTitle")
    gameTitleElement.innerHTML = "holis"
    newCard.hidden = false
}

const initialization = () => {
    createNewCard()
}
addEventListener("DOMContentLoaded", initialization)

