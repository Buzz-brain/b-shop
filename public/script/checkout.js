var form = document.billingDetails
var messagebox = document.getElementById("message");
form.checkbox.checked = true;

form.onsubmit = (e) => {
    e.preventDefault()
        if (form.firstname.value.trim() == "" || form.companyName.value.trim() == "" || form.streetAddress.value.trim() == "" || form.apartment.value.trim() == "" || form.town.value.trim() == "" || form.phoneNumber.value.trim() == "" || form.emailAddress.value.trim() == "")
        {
            messagebox.innerHTML = "All Fields are required"
            messagebox.style.transform = "translate(0%)";
        } 
        else 
        {
            messagebox.innerHTML = "Billing details saved"
            messagebox.style.transform = "translate(0%)";
            messagebox.style.color= "orangered";
            setTimeout(() => {
                form.submit()
            }, 2000)
        }
    removeMessage();
}

function removeMessage() {
    setTimeout(() => {
        messagebox.style.transform = "translate(-120%)";
        messagebox.style.color= "red"
    }, 2000)
}







// function updateCartUI() {
    // Retrieve cart data from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Get the container element where cart items will be displayed
    const checkoutContainer = document.querySelector('.checkoutSection');

    // Clear previous cart items before updating
    checkoutContainer.innerHTML = "";

    if (cartItems.length == 0) {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<div style="text-align:center" class="wishlistEmpty">
                                    <img width=280px" src="/images/noCheckout.jpg" alt="">
                                    <p class="emptyText">No item in checkout!</p>
                                <div>`
        checkoutContainer.appendChild(itemElement);
    } else {
    // Loop through cart items and generate HTML for each item
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
        <div class="cartProduct">
            <div class="cartImage">
                <img src="${item.productImg}" alt="product image">
                <p>${item.productName}</p>
            </div>
            <div class="quantityCtn flex-center">
                <div id="quantity">
                    <p data-id="${item.productId}">${item.quantity}</p>
                </div>
            </div>
            <p id="subtotal">
            &dollar;
            <span>${item.price * item.quantity}</span>
            </p>
        </div>
    </div>
        `;
        checkoutContainer.appendChild(itemElement);
    });

    let totalCount = 0
    for(i=0; i<cartItems.length; i++) {
        totalCount += parseFloat(cartItems[i].quantity)
        cartCount.textContent = totalCount
        cartCountTwo.textContent = totalCount
    }
    let total = 0
    for(i=0; i<subtotal.length; i++) {
        total += parseFloat(subtotal[i].textContent)
        subTOTAL.textContent = total
    }

    Total.textContent = parseFloat(subTOTAL.textContent) + parseFloat(shippingPrice.textContent)  
    }
    // Get the modal
var modal = document.getElementById("orderModal");

var _learnq = window._learnq || [];

// Get the button that opens the modal
const placeOrderBtn = document.getElementById("placeOrder");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
placeOrderBtn.addEventListener('click', () => {
    if (form.firstname.value.trim() == "")
        {
            messagebox.innerHTML = "All Fields are required"
            messagebox.style.transform = "translate(0%)";
        } 
        else {
        modal.style.display = "block";
        // modal.style.
        let Total = document.getElementById("Total");
        let amt = document.getElementsByClassName("amtPay")[0];
        let amt2 = document.form.amount;
        amt.textContent = Total.textContent;
        amt2.value = Total.textContent;
        let emailAdd = document.billingDetails.emailAddress.value;
        let phoneNumber = document.billingDetails.phoneNumber.value;
        
        let emailModal = document.getElementsByClassName("email")[0];
        emailModal.style.pointerEvents = "none";
        let phoneNumberModal = document.getElementsByClassName("phoneNumber")[0];
        emailModal.value = emailAdd
        phoneNumberModal.value = phoneNumber

        _learnq.push([
          "identify",
          {
            $email: emailModal.value,
          },
        ]);

        _learnq.push([
          "track",
          "Started Checkout",
          {
            cart_total: Total.textContent,
            item_count: cartCount.textContent,
            url: window.location.href,
          },
        ]);

        console.log(emailModal.value, Total.textContent, cartCount.textContent, window.location.href);

        console.log("Klaviyo: Started Checkout event fired");
        }
    })

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", () => {
  modal.style.display = "none";
})

    // Add event listener for input changes
    const quantityInputs = document.querySelectorAll('.quantity-input')
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.dataset.id;
            const newQuantity = parseInt(input.value, 10);
            adjustQuantity(productId, newQuantity);
        });
    })

    // Add event listener for remove buttons
    const removeButtons = document.querySelectorAll('.removeCartItemBtn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            removeCartItem(productId);
        });
    });
// }





