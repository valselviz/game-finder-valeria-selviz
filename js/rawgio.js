export function fetchGames(){
    const requestOptions = {
        headers: {
            "Target-URL": "https://rawg.io",
            "Authorization": "" // the cors-proxy expects this attribute, otherwise it fails
        }
    }
    const responsePromise = fetch("http://localhost:3000/api/games?key=c44227f248074d62bed3059005616f3d", requestOptions)
    
    return responsePromise.then(resp => resp.json())
    
}

