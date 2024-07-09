var form = document.form
var contactMessage = document.getElementById("message");

form.onsubmit = (e) => {
    e.preventDefault()
        if (form.name.value == "" || form.email.value == "" || form.phoneNumber.value == "" || form.messageArea.value == "") 
        {
            contactMessage.innerHTML = "All Fields are required"
            contactMessage.style.transform = "translate(0%)";
        } 
        else 
        {
            contactMessage.innerHTML = "Message sent succesfully"
            contactMessage.style.transform = "translate(0%)";
            contactMessage.style.color = " green"
            form.submit()
        }
    removecontactMessage();
}

function removecontactMessage() {
    setTimeout(() => {
            message.style.transform = "translate(-120%)";
            message.style.color= "red"
    }, 2000)
}



