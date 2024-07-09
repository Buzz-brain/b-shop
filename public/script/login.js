var form = document.form
var message = document.getElementById("message");
var keepMeLoggedIn = document.getElementsByClassName("keepMeLoggedIn");
// Regular expression pattern for validating an email
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

keepMeLoggedIn.checkbox.checked = true;

form.onsubmit = async (e) => {
    e.preventDefault();
    
    if (form.email.value == "" && form.password.value == "") {
        message.innerHTML = "Email and Password are required";
        message.style.transform = "translate(0%)";
    } else if (form.email.value == "") {
        message.innerHTML = "Email is required";
        message.style.transform = "translate(0%)";
    } else if (form.password.value == "") {
        message.innerHTML = "Password is required";
        message.style.transform = "translate(0%)";
    } else if (!emailPattern.test(form.email.value)) {
        message.innerHTML = "Input a valid email address";
        message.style.transform = "translate(0%)";
    } else {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: form.email.value,
                    password: form.password.value
                })
            });

        const result = await response.json();

        if (response.status === 401) {
            message.innerHTML = result.message;
            message.style.transform = "translate(0%)";
        } else if (response.ok) {
            message.innerHTML = result.message;
            message.style.transform = "translate(0%)";
            message.style.color = "green";
            document.getElementById('loader').style.display = 'flex';
            setTimeout(() => {
                window.location.href = "/";  // Redirect to the index page
            }, 2000);
        } else {
            message.innerHTML = result.message || "An error occurred";
            message.style.transform = "translate(0%)";
        }
    } catch (error) {
        console.error("Login error:", error);
        message.innerHTML = "Internal Server Error";
        message.style.transform = "translate(0%)";
    }
}
removeMessage();
};

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

