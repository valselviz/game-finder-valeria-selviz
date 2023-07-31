import { loadGames, loadNextPage, gameHasPlatform, getGameExtraInfo, getGameVideo, getGameScreenshots } from './rawgio.js';
import { refreshVisualMode } from "./visual-mode.js";
import { checkAccessToken, eraseAccessToken } from './access-token.js';

// Game count variable
let totalGames = 0

// List of parent platform ID
const pcId = 1
const playstationId = 2
const xboxId = 3
const nintendoId = 7

// array of additional game details fetched individually from rawg API
const gameDetails = []

function debounce (func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout (() => { func.apply(this,args); }, timeout);
    }
}

function parseDate(dateStrig) {
    const date = new Date(dateStrig)
    return `${date.toLocaleString('en-US', {month: 'short'})} ${date.getDate()}, ${date.getFullYear()}`
}

function createGameCards(gamesData){
    for(let i = 0; i < gamesData.results.length; i++){
        const currentGame = gamesData.results[i]
        createNewCard(currentGame, totalGames + i)
    }
    totalGames += 20
}

let nextPage

async function showGames(searchQuery, dateRange, ordering){
    // we need to remove all games in case we are searching for new games
    totalGames = 0
    gamesContainer.innerHTML = ""
    const gamesResponse = await loadGames(searchQuery, dateRange, ordering)
    nextPage = gamesResponse.next
    if (gamesResponse.results.length > 0){
        createGameCards(gamesResponse)
    } else {
        gamesContainer.innerHTML = "No games to show"
    }
}

function saveLastsSearchesAndRefreshOptions(searchQuery){
    const storedLastSearches = localStorage.getItem("lastSearches")
    let lastSearches 
    if (storedLastSearches){
        lastSearches = JSON.parse(storedLastSearches)
    } else {
        lastSearches = []
    }
    if (searchQuery){
        if (!lastSearches.includes(searchQuery)){
            lastSearches.unshift(searchQuery)
        }
        if (lastSearches.length > 10){
            lastSearches.pop()
        }
    }
    localStorage.setItem("lastSearches", JSON.stringify(lastSearches))
    searches.innerHTML = ""
    lastSearchesDiv.innerHTML = ""
    for (let i = 0; i < lastSearches.length; i++){
        const opt = document.createElement("option")
        opt.innerHTML = lastSearches[i]
        searches.appendChild(opt)
    }
    if (lastSearches.length > 0){
        for (let i = 0; i < lastSearches.length; i++){
            const p = document.createElement("p")
            p.innerHTML = lastSearches[i]
            p.onclick = () => {
                showGames(lastSearches[i], null, null)
            }
            lastSearchesDiv.appendChild(p)
        }
        const pEraseLastSearches = document.createElement("p")
        pEraseLastSearches.innerHTML = "Clean search history"
        pEraseLastSearches.addEventListener("click", () => {
            localStorage.setItem("lastSearches", JSON.stringify([]))
            lastSearchesDiv.innerHTML = ""
            searches.innerHTML = ""
        })
        lastSearchesDiv.appendChild(pEraseLastSearches)
    } 
}

async function createNewCard(game, gameCount){
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
    const genreDiv = newCard.querySelector(`.genres`)
    genreDiv.innerHTML = genreNames.join(", ")

    genreDiv.addEventListener("mouseenter", () => {
        genreHoverDiv.innerHTML = ""
        for (const genreName of genreNames){
            const div = document.createElement("div")
            const para = document.createElement("p")
            const node = document.createTextNode(genreName)
            para.appendChild(node)
            div.appendChild(para)
            genreHoverDiv.appendChild(div)
        }
        genreHoverDiv.style.display = ""
    })
    genreDiv.addEventListener("mouseleave", () => {
        genreHoverDiv.style = "display: none;"
    })

    if (!await gameHasPlatform(pcId, game.platforms)){
        newCard.querySelector(`.pcIcon`).hidden = true
    }
    if (!await gameHasPlatform(playstationId, game.platforms)){
        newCard.querySelector(`.playstationIcon`).hidden = true
    }
    if (!await gameHasPlatform(xboxId, game.platforms)){
        newCard.querySelector(`.xboxIcon`).hidden = true
    }
    if (!await gameHasPlatform(nintendoId, game.platforms)){
        newCard.querySelector(`.nintendoIcon`).hidden = true
    }

    const extraInfo = await getGameExtraInfo(game.id)
    gameDetails[gameCount] = extraInfo
    newCard.querySelector(`.descriptionText`).innerHTML = extraInfo.description


    newCard.hidden = false
}

function refreshGamesWithSearchCriteria() {
    let search = searchInput.value;
    showGames(search, null, null)
    saveLastsSearchesAndRefreshOptions(search)
}

function changeCardsDisplay(containerClass) {
    gamesContainer.className = containerClass
    if (containerClass == "threeColumnsView") {
        threeColumnsIcon.src = threeColumnsIcon.src.replace("three-column-disabled", "three-column-active") 
        singleColumnIcon.src = singleColumnIcon.src.replace("single-column-active", "single-column-disabled") 
        for (const description of gamesContainer.querySelectorAll(`.description`)){
            description.hidden = true
        }
    } else {
        threeColumnsIcon.src = threeColumnsIcon.src.replace("three-column-active", "three-column-disabled") 
        singleColumnIcon.src = singleColumnIcon.src.replace("single-column-disabled", "single-column-active") 
        for (const description of gamesContainer.querySelectorAll(`.description`)){
            description.hidden = false
        }
    }
}


function openFloatingCard(event, game, gameCount){
    // I need to stop the propagation of this event
    // Otherwise, the function that closes the floating card will executed immediately after this function
    // Because that function is execution when a click happens
    event.stopPropagation()

    document.querySelector("header").className = "hiddenOnMobileOrTablet"
    titleContainer.className = "hiddenOnMobileOrTablet"
    mainContainer.className = "hiddenOnMobileOrTablet"

    floatingCardContainer.querySelector(`.trailerVideo`).hidden = true
    floatingCardContainer.querySelector(`.screenshots`).innerHTML = ""
    floatingCardContainer.style = ""

    const visualMode = localStorage.getItem("visualMode")
    const backgroundColor = visualMode == "dark" ? "#303030FF" : "#F0F0F0FF"
    const backgroundImageStyle = `background-image: linear-gradient(to bottom, #00000000, ${backgroundColor}), url("${game.background_image}")`
    floatingCardContainer.querySelector(`#floatingCard`).style = backgroundImageStyle
    floatingCardContainer.querySelector(`.gameTitle`).innerHTML = game.name
    floatingCardContainer.querySelector(`.rankingTag .purpleText`).innerHTML = "#" + (gameCount + 1)
    floatingCardContainer.querySelector(`.dateReleaseTag .grayText`).innerHTML = game.released
    
    const gameDescription = gameDetails[gameCount].description
    const maxDescriptionLength = 330
    if (gameDescription.length > maxDescriptionLength) {
        floatingCardContainer.querySelector(`.descriptionText`).innerHTML = gameDescription.substring(0, maxDescriptionLength) + '...'
        descriptionReadMore.hidden = false
    } else {
        floatingCardContainer.querySelector(`.descriptionText`).innerHTML = gameDescription
        descriptionReadMore.hidden = true
    }
    floatingCardContainer.querySelector(`.descriptionTextLong`).innerHTML = gameDescription

    // use the 'map' function to convert an array of parent platforms objects, into 
    // an array of platform names (strings)
    const platformNames = game.parent_platforms.map(parentPlatform => parentPlatform.platform.name)
    floatingCardContainer.querySelector(`.platformsText`).innerHTML = platformNames.join(", ")

    floatingCardContainer.querySelector(`.dateReleaseTag .grayText`).innerHTML = parseDate(game.released)

    floatingCardContainer.querySelector(`.releaseDate`).innerHTML = parseDate(game.released)

    if (gameDetails[gameCount].publishers.length > 0){
        floatingCardContainer.querySelector(`.publisher`).innerHTML = gameDetails[gameCount].publishers[0].name
    } else {
        floatingCardContainer.querySelector(`.publisher`).innerHTML = "Not available"
    }
    if (!gameDetails[gameCount].website == ""){
        floatingCardContainer.querySelector(`.website`).href = gameDetails[gameCount].website
        floatingCardContainer.querySelector(`.website`).innerHTML = gameDetails[gameCount].website
    } else {
        floatingCardContainer.querySelector(`.website`).innerHTML = "Not available"
    }    
    if (gameDetails[gameCount].developers.length > 0){
        floatingCardContainer.querySelector(`.developer`).innerHTML = gameDetails[gameCount].developers[0].name
    } else {
        floatingCardContainer.querySelector(`.developer`).innerHTML = "Not available"
    }
    if (!gameDetails[gameCount].esrb_rating == null){
        floatingCardContainer.querySelector(`.ageRating`).innerHTML = gameDetails[gameCount].esrb_rating.name
    } else {
        floatingCardContainer.querySelector(`.ageRating`).innerHTML = "Not available"
    }
    

    // use the 'map' function to convert an array of genre objects, into 
    // an array of genre names (strings)
    const genreNames = game.genres.map(genre => genre.name)
    floatingCardContainer.querySelector(`.genres`).innerHTML = genreNames.join(", ")


    const videoPromise = getGameVideo(game.id)
    const screenshotsPromise = getGameScreenshots(game.id)
    videoPromise.then(videoJson => {
        if(videoJson.results.length > 0){
            floatingCardContainer.querySelector(`video`).src = videoJson.results[0].data[480]
            floatingCardContainer.querySelector(`.trailerVideo`).hidden = false
        }

        // Notice that I can not tell which one of the video request or the screenshots request will finish first.
        // I indicate what should be done with the screenshots after the video response has been returned
        // That way I can be sure that the following code will not fail by checkig a video response that has not arrived yet
        screenshotsPromise.then(screenshotsJson => {
            let screenshotsCount
            if(videoJson.results.length > 0){
                screenshotsCount = 4
            } else {
                screenshotsCount = 5
            }
            for (let i = 0; i < screenshotsCount; i++){
                const newImg = document.createElement("img")
                if (i < screenshotsJson.results.length){
                    newImg.src = screenshotsJson.results[i].image
                }
                else {
                    newImg.src = "/assets/common/floating-card-icons/missing-img/missing-img.png"
                }
                floatingCardContainer.querySelector(`.screenshots`).appendChild(newImg)
            }
            if (videoJson.results.length == 0){
                floatingCardContainer.querySelectorAll(`.screenshots img`)[0].style = "width: 100%;"
            }
        })
    })
}

function closeFloatingCard() {
    if (floatingCardContainer.style.display == "") {
        floatingCardContainer.style = "display: none;"
        floatingCardContainer.className = floatingCardContainer.className.replace(" fullDescription", "")
    }
    document.querySelector("header").className = ""
    titleContainer.className = ""
    mainContainer.className = ""
}

function openLogoutModal() {
    logoutModalContainer.style = ""
}

function closeModalContainer() {
    if (logoutModalContainer.style.display == "") {
        logoutModalContainer.style = "display: none;"
    }
}

function formatDate(date) {
    return date.toISOString().split("T")[0]
}

addEventListener("DOMContentLoaded", e => {
    checkAccessToken()
    refreshVisualMode()
    showGames()
    saveLastsSearchesAndRefreshOptions(null)
    
    // Make sure to associate an event listener function to an html element after the setVisualMode gets executed
    // Because the setVisualMode might erase and recreate all the html elements, losing all the 
    // event listening funcitons previously assigned

    threeColumnsIcon.addEventListener("click", () => changeCardsDisplay("threeColumnsView"))
    singleColumnIcon.addEventListener("click", () => changeCardsDisplay("singleColumnView"))
    
    searchInput.addEventListener("change", refreshGamesWithSearchCriteria);
    
    // Clicking on the floating card background closes it
    floatingCardContainer.addEventListener("click", closeFloatingCard)
    // But when clicking the floating card itself, I should not let the event propagate to the background
    // because I don't want it to remain open
    floatingCard.addEventListener("click", e => e.stopPropagation())

    xButton.addEventListener("click", closeFloatingCard)

    // Open Log out modal
    logoutClick.addEventListener("click", openLogoutModal)

    // Close log out modal
    logoutModalContainer.addEventListener("click", closeModalContainer)
    modalDiv.addEventListener("click", e => e.stopPropagation())
    closeModal.addEventListener("click", closeModalContainer)
    noClick.addEventListener("click", closeModalContainer)

    // confirm log out
    yesButton.addEventListener("click", eraseAccessToken)
    logoutClickSidebar.addEventListener("click", eraseAccessToken)

    addEventListener("scroll", async (event) => {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;

        if (currentScroll >= documentHeight -10 && nextPage && totalGames > 0) {
            const gamesResponse = await loadNextPage(nextPage)
            nextPage = gamesResponse.next
            createGameCards(gamesResponse)
        }
    });

    displaySearchIcon.addEventListener("click", () => {
        searchBar.className = searchBar.className.replace("hiddenOnMobile", "")
    })

    hamburgerMenu.addEventListener("click", () => {
        if (sideBar.className != "") {
            sideBar.className = sideBar.className.replace("hiddenOnMobileOrTablet", "")
            gamesContainer.className += " hiddenOnMobileOrTablet"
            titleAndOptions.style.display = "none"
            document.querySelector("header").className = "hiddenOnMobileOrTablet"
        } else {
            sideBar.className += "hiddenOnMobileOrTablet"
            gamesContainer.className = gamesContainer.className.replace("hiddenOnMobileOrTablet", "")
            titleAndOptions.style.display = "flex"
        }
    })

    closeSidebar.addEventListener("click", () => {
        sideBar.className += "hiddenOnMobileOrTablet"
        document.querySelector("header").className = ""
        gamesContainer.className = gamesContainer.className.replace("hiddenOnMobileOrTablet", "")
        titleAndOptions.style.display = "flex"
    })

    hideSearchBox.addEventListener("click", () => {
        searchBar.className += " hiddenOnMobile"
    })

    visualModeSwitcher.addEventListener("click", () => {
        const currentVisualMode = localStorage.getItem("visualMode")
        if (currentVisualMode == "dark") {
            localStorage.setItem("visualMode", "light")
        } else {
            localStorage.setItem("visualMode", "dark")
        }
        refreshVisualMode()
    })

    visualModeSwitchSidebar.addEventListener("click", () => {
        const currentVisualMode = localStorage.getItem("visualMode")
        if (currentVisualMode == "dark") {
            localStorage.setItem("visualMode", "light")
        } else {
            localStorage.setItem("visualMode", "dark")
        }
        refreshVisualMode()
    })

    descriptionReadMore.addEventListener("click", () => {
        floatingCardContainer.className += " fullDescription"
    })

    backFromLongDescription.addEventListener("click", () => {
        floatingCardContainer.className = floatingCardContainer.className.replace(" fullDescription", "")
    })

    const delayedShowGames = debounce((datePeriod, ordering) => showGames(null, datePeriod, ordering))
    
    thisWeekSearch.addEventListener("click", () => {
        const currentDate = new Date()
        const otherDate = new Date()
        otherDate.setDate(otherDate.getDate() - 7)
        delayedShowGames(formatDate(otherDate) + "," + formatDate(currentDate), null)
    })

    thisMonthSearch.addEventListener("click", () => {
        const currentDate = new Date()
        const otherDate = new Date()
        otherDate.setMonth(otherDate.getMonth() - 1)
        delayedShowGames(formatDate(otherDate) + "," + formatDate(currentDate), null)
    })
    
    comingSoonSearch.addEventListener("click", () => {
        const currentDate = new Date()
        const otherDate = new Date()
        otherDate.setMonth(otherDate.getMonth() + 3)
        delayedShowGames(formatDate(currentDate) + "," + formatDate(otherDate), null)
    })    

    bestOfTheYearSearch.addEventListener("click", () => {
        const currentDate = new Date()
        const currentYear = new Date().getFullYear()
        const firstDay = new Date(currentYear, 0, 1)
        delayedShowGames(formatDate(firstDay) + "," + formatDate(currentDate), "&ordering=-rating")
    })

    addEventListener("mousemove", (event) => {
        genreHoverDiv.style = 
                "top: " + event.clientY + "px; " + 
                "left: " + event.clientX + "px;" +
                "display: " + genreHoverDiv.style.display
    })
})