// Get the modal
var modal = document.getElementById("orderModal");

// Get the button that opens the modal
const placeOrderBtn = document.getElementById("placeOrder");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
  placeOrderBtn.addEventListener('click', event => {
    modal.style.display = "block";
    })

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// let form = document.form
// console.log(form)

// document.getElementById("paymentForm").addEventListener("submit", async function(event) {
//   event.preventDefault();

//   // const formData = new FormData(this);

//   letformData = {
//     email: form.email.value,
//     amount: form.amount.value,
//     cardNumber: form.cardNumber.value,
//     expiryDate: form.expiryDate.value,
//     cvv: form.cvv.value,
//     fullName: form.fullName.value,
//     phoneNumber: form.phoneNumber.value,
//   }
  
//   console.log(formData);

//   try {
//     const response = await fetch("/checkout", {
//       method: "POST",
//       body: formData
//     });

//     if (response.ok) {
//       const paymentResponse = await response.json();
//       // Handle payment response
//       console.log(paymentResponse);
//     } else {
//       console.error("Payment request failed");
//     }
//   } catch (error) {
//     console.error("Error processing payment:", error);
//   }
// });
