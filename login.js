

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
/*
const triggerPassword = document.querySelector('.fa-eye');

const showPassword = trigger => {
  trigger.addEventListener('click', () => {
    if(trigger.previousElementSibling.getAttribute('type') === 'password'){
      trigger.previousElementSibling.setAttribute('type', 'text');
      trigger.classList.remove('fa-eye');
      trigger.classList.add('fa-eye-slash');
    }else if(trigger.previousElementSibling.getAttribute('type') === 'text'){
      trigger.previousElementSibling.setAttribute('type', 'password');
      trigger.classList.remove('fa-eye-slash');
      trigger.classList.add('fa-eye');
    }
  });
}

showPassword(triggerPassword);*/