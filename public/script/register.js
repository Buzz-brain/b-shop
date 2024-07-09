var form = document.form
var message = document.getElementById("message");
// Regular expression pattern for validating an email
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

form.onsubmit = (e) => {
    e.preventDefault()
        if (form.username.value.trim() == "" || form.username.value.trim() == "" || form.email.value.trim() == "" || form.password.value.trim() == "" || form.cPassword.value.trim() == "") 
        {
            message.innerHTML = "All Fields are required"
            message.style.transform = "translate(0%)";
        } 
        else if (form.firstname.value.trim().length < 5) 
        {
            message.innerHTML = "First name must be greater or equal to 5 characters"
            message.style.transform = "translate(0%)";
        } 
        else if (form.username.value.trim().length < 5) 
        {
            message.innerHTML = "Username must be greater or equal to 5 characters"
            message.style.transform = "translate(0%)";
        } 
        else if (!emailPattern.test(form.email.value)) {
            message.innerHTML = "Input a valid email address"
            message.style.transform = "translate(0%)";
        } 
        else if (form.password.value.trim().length !== 4) {
            message.innerHTML = "Password must be 4 characters"
            message.style.transform = "translate(0%)";
        } 
        else if (form.password.value.trim() !== form.cPassword.value.trim()) 
        {
            message.innerHTML = "Password does not match"
            message.style.transform = "translate(0%)";
        } 
        else if (form.password.value.trim() !== form.cPassword.value.trim()) 
        {
            message.innerHTML = "Password does not match"
            message.style.transform = "translate(0%)";
        } 
        else if (form.checkbox.checked == false) 
        {
            message.innerHTML = "Please agree with our term and conditions"
            message.style.transform = "translate(0%)";
        } 
        else 
        {
            message.innerHTML = "You've registered succesfully"
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
        message.style.color= "red"
    }, 2000)
}


form.firstname.addEventListener("focus", function () {
    form.firstname.previousElementSibling.style.display = "block"
})
form.username.addEventListener("focus", function () {
    form.username.previousElementSibling.style.display = "block"
})
form.email.addEventListener("focus", function () {
    form.email.previousElementSibling.style.display = "block"
})
form.password.addEventListener("focus", function () {
    form.password.previousElementSibling.style.display = "block"
})
form.cPassword.addEventListener("focus", function () {
    form.cPassword.previousElementSibling.style.display = "block"
})

