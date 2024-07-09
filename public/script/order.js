// Get the modal
var modal = document.getElementById("orderModal");

// Get the button that opens the modal
const placeOrderBtn = document.getElementById("placeOrder");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
placeOrderBtn.addEventListener('click', (event) => {
  modal.style.display = "block";
})

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", () => {
  modal.style.display = "none";
})
