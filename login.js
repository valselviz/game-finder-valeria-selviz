

function login(){
    const inputUserName = document.getElementById("userName")
    const inputUserPassword = document.getElementById("userPassword")   
    console.log({inputUserName})
    console.log(inputUserPassword)

    const Http = new XMLHttpRequest()
    const url='http://localhost:3000/login'
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify({
        "email": inputUserName.value,
        "password": inputUserPassword.value
    }))

    Http.onreadystatechange=function(){
        if (this.readyState == 4) {
            console.log(this.status)
            console.log(Http.responseText)
            console.log(this)
            console.log(Http)
            if (this.status == 200){

            }
            else if (this.status == 400){
                document.getElementById("errorText").hidden=false
            }
        }
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
