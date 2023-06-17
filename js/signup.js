
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

