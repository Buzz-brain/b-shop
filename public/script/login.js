var form = document.form
var message = document.getElementById("message");
form.onsubmit = (e) => {
    e.preventDefault()
        if (form.email.value == "" && form.password.value == "") 
        {
            message.innerHTML = "Email and Password is required"
            message.style.transform = "translate(0%)";
        } 
        else if (form.email.value == "") 
        {
            message.innerHTML = "Email is required"
            message.style.transform = "translate(0%)";

        } 
        else if (form.password.value == "") 
        {
            message.innerHTML = "Password is required"
            message.style.transform = "translate(0%)";
        }
        else 
        {
            message.innerHTML = "Login successful"
            message.style.transform = "translate(0%)";
            message.style.color= "green";
            setTimeout(() => {
                form.submit()
            }, 2000)
        }
    removeMessage();
}

function removeMessage() {
    setTimeout(() => {
        message.style.transform = "translate(-120%)";
    }, 2000)
}

form.email.addEventListener("focus", function () {
    form.email.previousElementSibling.style.display = "block"
})
form.password.addEventListener("focus", function () {
    form.password.previousElementSibling.style.display = "block"
})

