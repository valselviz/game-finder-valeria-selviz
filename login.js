
async function login(){
    const inputUserName = document.getElementById("userName")
    const inputUserPassword = document.getElementById("userPassword") 
    const url='http://localhost:3000/login'
    const body = JSON.stringify({
        "email": inputUserName.value,
        "password": inputUserPassword.value
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
        document.getElementById("errorText").hidden=false

        const passwordDiv = document.getElementById("userPassword").parentNode
        passwordDiv.className+=" formInputError"

        const nameDiv = document.getElementById("userName").parentNode
        nameDiv.className+=" formInputError"
    }
}

function createUser(){
    const Http = new XMLHttpRequest()
    const url='http://localhost:3000/users/register'
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify({
        "email": "usuario@mail.com",
        "password": "Pass.4321"
    }))

    Http.onreadystatechange=function(){
        if (this.readyState == 4) {
            console.log(this.status)
            console.log(Http.responseText)
            console.log(this)
            console.log(Http)
        }
    }
}


function showPassword() {
    console.log("hola")
    const icon = document.getElementById("eyeIcon")
    const passwordInput = document.getElementById("userPassword")

    if(passwordInput.getAttribute('type') === 'password'){
        passwordInput.setAttribute('type', 'text');
        //icon.classList.remove('fa-eye');
        //icon.classList.add('fa-eye-slash');
    }
    else if(passwordInput.getAttribute('type') === 'text'){
        passwordInput.setAttribute('type', 'password');
        //icon.classList.remove('fa-eye-slash');
        //icon.classList.add('fa-eye');
    }
}
