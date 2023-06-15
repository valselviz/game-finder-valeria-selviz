
async function login(){
    const inputUserName = document.getElementById("userName")
    const inputUserPassword = document.getElementById("userPassword") 
    const url='http://localhost:3000/login'
    const body = JSON.stringify({
        email: inputUserName.value,
        password: inputUserPassword.value
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

function setErrorMessage(message){
    const errorParagraph = document.getElementById('errorText')
    errorParagraph.setHTML(message)
    errorParagraph.hidden=false
}

function validatePassword(password){
    
    //validate the length
  if (password.length < 8) {
    setErrorMessage('The password should be at least 8 characters long')
    return false;
  } 
  //validate letter
  if (!password.match(/[a-z]/)) {
    setErrorMessage('The password should contain a lowercase letter')
    return false;
  } 
  //validate capital letter
  if (!password.match(/[A-Z]/)) {
    setErrorMessage('The password should contain a upercase letter')
    return false;
  } 
  //validate special character
  if (!password.match(/[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/)) {
    setErrorMessage('The password should contain special characters')
    return false;
  } 
  //validate number
  if (!password.match(/\d/)) {
    setErrorMessage('The password should contain numbers')
    return false;
  } 
  return true
}

async function createUser(){
    const inputUserName = document.getElementById("userName")
    const inputUserPassword = document.getElementById("userPassword") 

    const passwordIsValid = validatePassword(inputUserPassword.value)

    if (passwordIsValid == true){
        const url='http://localhost:3000/users/register'
        const body = JSON.stringify({
            email: inputUserName.value,
            password: inputUserPassword.value
        })

        const response = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await response.json()
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
