// Get the modal
var modal = document.getElementById("productModal");

// Get the button that opens the modal
const viewDetailsBtn = document.querySelectorAll('#viewDetailsBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
viewDetailsBtn.forEach(btn => {
    btn.addEventListener('click', event => {
    modal.style.display = "block";
    const productContainer = event.target.closest('.productCtn');
    const productName = productContainer.querySelector('.productName').textContent;
    const brandName = productContainer.querySelector('.brandName').textContent;
    const rating = productContainer.querySelector('.rating').textContent;
    const price = parseFloat(productContainer.querySelector('.price').textContent);
    const delPrice = parseFloat(productContainer.querySelector('.delPrice').textContent);
    const productImg = productContainer.querySelector('.product-img').src;
    // Populate modal with product details (you'll need to implement this)
    // For example:
    document.getElementById("productImageModal").src = productImg
    document.getElementsByClassName("productNameModal")[0].innerText = productName
    document.getElementsByClassName("brandNameModal")[0].innerText = brandName
    document.getElementsByClassName("ratingModal")[0].innerText = rating
    document.getElementsByClassName("delPriceModal")[0].innerText = delPrice
    document.getElementsByClassName("priceModal")[0].innerText = price
    })
});

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
