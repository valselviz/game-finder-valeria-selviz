import { refreshVisualMode } from "./visual-mode.js"

async function login(){
    const url='http://localhost:3000/login'
    const body = JSON.stringify({
        email: userName.value,
        password: userPassword.value
    })

    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await response.json()
    console.log(json)

    if (response.status == 200){ //if the request was successful, continue with login
        //const response = JSON.parse(Http.responseText)
        document.cookie = "accessToken=" + json.accessToken
        // Simulate an HTTP redirect to the home page
        window.location.replace("/home.html");
    }
    else if (response.status == 400){ // if the request failed, show error
        errorText.hidden=false

        userPassword.parentNode.className += " formInputError"
        userName.parentNode.className += " formInputError"
    }
}

function showPassword() {
    if(userPassword.getAttribute('type') === 'password'){
        userPassword.setAttribute('type', 'text');
    }
    else if(userPassword.getAttribute('type') === 'text'){
        userPassword.setAttribute('type', 'password');
    }
}

addEventListener("DOMContentLoaded", e => {

    refreshVisualMode()

    loginButton.addEventListener("click", login) 

    eyeIcon.addEventListener("click", showPassword)
})
