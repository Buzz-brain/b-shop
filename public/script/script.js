let accIcon = document.getElementById("accIcon");
let accountOverlay = document.getElementById("accountOverlay");
let message = document.getElementById("message");

accIcon.addEventListener("mouseover", function () {
    accountOverlay.style.display = "block"
})
accountOverlay.addEventListener("mouseover", function () {
    accountOverlay.style.display = "block"
})
accIcon.addEventListener("mouseleave", function () {
    accountOverlay.style.display = "none"
})
accountOverlay.addEventListener("mouseleave", function () {
    accountOverlay.style.display = "none"
})

let wishlistCount = document.getElementById("wishlistCount");
let wishlistCountTwo = document.getElementById("wishlistCountTwo");
let cartCount = document.getElementById("cartCount");
let cartCountTwo = document.getElementById("cartCountTwo");
let subtotal = document.getElementsByClassName("subtotal");
let subTOTAL = document.getElementById("subTOTAL");
let shippingPrice = document.getElementById("shippingPrice");
let Total = document.getElementById("Total");

// Initialize values
cartCount.textContent = 0
cartCountTwo.textContent = 0
wishlistCount.textContent = 0
wishlistCountTwo.textContent = 0
shippingPrice.textContent = 120.00
subTOTAL.textContent = 0.00
Total.textContent = 0.00

// When page loads
window.onload = function() {
    updateCartUI();
    updateWishlistUI();
}

// Add event listeners for "Add to Cart" buttons

const addToCartButtons = document.querySelectorAll('.addToCartBtn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
        // Get product details from the clicked button or its container
        const productContainer = event.target.closest('.productCtn');
        const productId = button.dataset.id;
        const productName = productContainer.querySelector('.productName').textContent;
        const categoryName = productContainer.querySelector('.categoryName').textContent;
        const rating = productContainer.querySelector('.rating').textContent;
        const price = parseFloat(productContainer.querySelector('.price').textContent);
        const delPrice = parseFloat(productContainer.querySelector('.delPrice').textContent);
        const productImg = productContainer.querySelector('.product-img').src;
        console.log(productImg)
        // Call the addToCart function with the product details
        addToCart(productId, productName, categoryName, rating, price, delPrice, productImg);
    });
});

// Add event listeners for "Add to Wishlist" buttons
const addToWishlistButtons = document.querySelectorAll('.wishlistBtn');
addToWishlistButtons.forEach(button => {
    button.addEventListener('click', event => {
        // Get product details from the clicked button or its container
        const productContainer = event.target.closest('.productCtn');
        const productId = button.dataset.id;
        const productName = productContainer.querySelector('.productName').textContent;
        const categoryName = productContainer.querySelector('.categoryName').textContent;
        const rating = productContainer.querySelector('.rating').textContent;
        const price = parseFloat(productContainer.querySelector('.price').textContent);
        const delPrice = parseFloat(productContainer.querySelector('.delPrice').textContent);
        const productImg = productContainer.querySelector('.product-img').src;
        console.log(productId)
        // Call the addToCart function with the product details
        addToWishlist(productId, productName, categoryName, rating, price, delPrice, productImg);
    });
});

let cartItemNumber = 0;

// Function to add item to cart
function addToCart(productId, productName, categoryName, rating, price, delPrice, productImg) {
    cartItemNumber++
    cartCount.textContent++
    message.style.transform = "translate(0%)";
    message.style.color= "orangered";
    message.innerHTML = cartItemNumber + " Product added to Cart"
    removeMessage()

    // Example product object
    const product = {
        productId: productId,
        productImg: productImg,
        productName: productName,
        categoryName: categoryName,
        rating: rating,
        price: price,
        delPrice: delPrice,
        quantity: 1 // Initial quantity
    };

    // Klaviyo 'Added to cart' event tracking
    if (typeof _learnq !== 'undefined') {
        _learnq.push(['track', 'Added to cart', {
            ProductName: productName,
            ProductID: productId,
            Price: price,
            Quantity: 1,
            Site: 'WebsiteA', // Optionally set your site name
            URL: window.location.href
        }]);
    }

    // Get existing cart items from local storage or initialize empty array
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the product is already in the cart
    const existingItem = cartItems.find(item => item.productId === productId);
    if (existingItem) {
        // Increment quantity if product is already in cart
        existingItem.quantity++;
    } else {
        // Add new product to cart
        cartItems.push(product);
    }

    // Update local storage with updated cart items
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Optional: Update cart UI to reflect changes
    updateCartUI();
}

// Function to add item to wishlist
function addToWishlist(productId, productName, categoryName, rating, price, delPrice, productImg) {

    // Example product object
    const product = {
        productId: productId,
        productImg: productImg,
        productName: productName,
        categoryName: categoryName,
        rating: rating,
        price: price,
        delPrice: delPrice,
        quantity: 1 // Initial quantity
    };

    // Get existing cart items from local storage or initialize empty array
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Check if the product is already in the cart
    const existingItem = wishlistItems.find(item => item.productId === productId);
    let wishItem = 0;
    if (existingItem) {
        // Increment quantity if product is already in cart
        // alert("Product already added to wishlist")
        message.style.transform = "translate(0%)";
        message.style.color= "orangered";
        message.innerHTML = "Product already added to wishlist"
        removeMessage()
    } else {
        // Add new product to cart
        wishlistCount.textContent++
        wishItem += 1
        message.style.transform = "translate(0%)";
        message.style.color= "orangered";
        message.innerHTML = wishItem + " Product added to Wishlist"
        removeMessage()
        wishlistItems.push(product);
    }

    // Update local storage with updated cart items
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));

    // Optional: Update cart UI to reflect changes
    updateWishlistUI();
}

// Attach event listener to the "Move All to Cart" button or link
let moveAllToCartBtn = document.getElementsByClassName("moveAllToCartBtn")[0];
moveAllToCartBtn.addEventListener('click', moveAllToCart);

// Function to move all wishlist items to cart
function moveAllToCart() {
    // Retrieve wishlist items from local storage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Retrieve cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    console.log(wishlistItems)
    if (wishlistItems.length === 0) {
        message.style.transform = "translate(0%)";
        message.style.color= "orangered";
        message.innerHTML = "No product in wishlist"
    } else{
        // Add each wishlist item to cart
        wishlistItems.forEach(item => {
            if (!cartItems.find(cartItem => cartItem.id === item.id)) {
                // If not, add it to the cart
                cartItems.push(item);
            }
        });

    // Save updated cart items to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Optionally, remove wishlist items from local storage
    localStorage.removeItem('wishlistItems');

    updateWishlistUI()
    updateCartUI()

    message.style.transform = "translate(0%)";
    message.style.color= "orangered";
    message.innerHTML = "All wishlist items moved to cart successfully"
}
    removeMessage()
}



// Function to update the cart UI on the cart page
function updateCartUI() {
    // Retrieve cart data from local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Get the container element where cart items will be displayed
    const cartContainer = document.querySelector('.cartSection');

    // Clear previous cart items before updating
    cartContainer.innerHTML = "";

    if (cartItems.length == 0) {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<div style="text-align:center" class="wishlistEmpty">
                                    <img width=280px" src="/images/cartEmpty.jpg" alt="">
                                    <p class="emptyText">Your Cart is empty!</p>
                                <div>`
        cartContainer.appendChild(itemElement);
    } else {

    // Loop through cart items and generate HTML for each item
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
        <div class="cartProduct">
            <div class="cartImage">
                <img style="cursor:pointer" title="${item.productName}" src="${item.productImg}" alt="product image">
                <p>${item.productName}</p>
            </div>
            <p id="price">$${item.price}</p>
            <div class="quantityCtn flex-center">
                <div id="quantity">
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.productId}">
                </div>
            </div>
            <p id="subtotal">&dollar;
            <span class="subtotal">${item.price * item.quantity}</span>
            </p>
            <div class="removeCartItemBtn" data-id="${item.productId}">
            <div>
                <img src="/css/icons/bin.png" alt="">
            </div>
        </div>
    </div>
        `;
        cartContainer.appendChild(itemElement);
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
    
    // Add event listener for input changes
    const quantityInputs = document.querySelectorAll('.quantity-input')
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.dataset.id;
            const newQuantity = parseInt(input.value, 10);
            adjustQuantity(productId, newQuantity);
        });
    })
    }
    // Add event listener for remove buttons
    const removeButtons = document.querySelectorAll('.removeCartItemBtn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            removeCartItem(productId);
        });
    });
}

// Function to update the cart UI on the cart page
function updateWishlistUI() {
    // Retrieve cart data from local storage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    let totalCount = 0
    for(i=0; i<wishlistItems.length; i++) {
        totalCount += parseFloat(wishlistItems[i].quantity)
        wishlistCount.innerHTML = totalCount
        wishlistCountTwo.textContent = totalCount
    }

    // Get the container element where wishlist items will be displayed
    const wishlistContainer = document.querySelector('.wishlistSection');

    wishlistContainer.innerHTML = '';

    if (wishlistItems.length == 0) {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<div style="text-align:center" class="wishlistEmpty">
        <img width=300px" src="/images/wishlistEmpty.png" alt=""><p class="emptyText">Your Wishlist is empty!</p>
        <div>`
        wishlistContainer.appendChild(itemElement);
    } else {
        // // Clear previous cart items before updating
        // wishlistContainer.innerHTML = '';

        // Loop through cart items and generate HTML for each item
        wishlistItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('wishlist-item');
            itemElement.innerHTML = `
            <div class="productCtn">
            <div class="productCtnOne">
                <div class="flex">
                    <div class="binCtn removeWishlistItemBtn" data-id="${item.productId}">
                        <img src="/css/icons/bin.png" alt="">
                    </div>
                    <div id="viewDetailsBtn" class="binCtn view">
                                            <img src="/css/icons/viewBlack.png" alt="">
                                        </div>
                </div>
                <div class="productImg">
                    <img class="product-img" src="${item.productImg}" alt="product image">
                </div>
            </div>
            <div class="productCtnTwo">
                <p class="productName">${item.productName}</p>
                <p class="categoryName">${item.categoryName}</p>
                <div class="ratingCtn">
                    <img src="/css/icons/star.png" alt="rating icon"> 
                    <p class="rating">${item.rating}</p>
                </div>
                <div class="priceCtn">
                $<del><p class="delPrice">${item.delPrice}</p></del>
                    $<p class="price">${item.price}</p>
                </div>
            </div>
        </div>`
            wishlistContainer.appendChild(itemElement);
        });
    }

    // Add event listener for remove buttons
    const removeButtons = document.querySelectorAll('.removeWishlistItemBtn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            removeWishlistItem(productId);
        });
    });

   // Get the modal
var modalwish = document.getElementById("productModal");

// Get the button that opens the modal
const viewDetailsBtn = document.querySelectorAll('#viewDetailsBtn');

// Get the <span> element that closes the modal
var spanwish = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
viewDetailsBtn.forEach(btn => {
    btn.addEventListener('click', event => {
    modalwish.style.display = "block";
    const productContainer = event.target.closest('.productCtn');
    const productName = productContainer.querySelector('.productName').textContent;
    const categoryName = productContainer.querySelector('.categoryName').textContent;
    const rating = productContainer.querySelector('.rating').textContent;
    const price = parseFloat(productContainer.querySelector('.price').textContent);
    const delPrice = parseFloat(productContainer.querySelector('.delPrice').textContent);
    const productImg = productContainer.querySelector('.product-img').src;
    // Populate modal with product details (you'll need to implement this)
    // For example:
    document.getElementById("productImageModal").src = productImg
    document.getElementsByClassName("productNameModal")[0].innerText = productName
    document.getElementsByClassName("categoryNameModal")[0].innerText = categoryName
    document.getElementsByClassName("ratingModal")[0].innerText = rating
    document.getElementsByClassName("delPriceModal")[0].innerText = delPrice
    document.getElementsByClassName("priceModal")[0].innerText = price
    })
});

// When the user clicks on <span> (x), close the modal
spanwish.onclick = function() {
  modalwish.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalwish) {
    modalwish.style.display = "none";
  }
}

}

// Function to adjust the quantity of a product
function adjustQuantity(productId, newQuantity) {
    // Retrieve cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Find the index of the product in the cart
    const itemIndex = cartItems.findIndex(item => item.productId === productId);
    console.log(itemIndex);

    if (itemIndex !== -1) {
        // Update quantity with the new value
        cartItems[itemIndex].quantity = newQuantity;

        // Ensure quantity is at least 1
        if (cartItems[itemIndex].quantity < 1) {
            cartItems[itemIndex].quantity = 1;
        }

        // Update local storage with updated cart items
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the cart UI to reflect changes
        updateCartUI();
        updateWishlistUI();
    }
}

// Function to remove an item from the cart
function removeCartItem(productId) {
    // Retrieve cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Filter out the item to be removed
    cartItems = cartItems.filter(item => item.productId !== productId);

    // Update local storage with updated cart items
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart UI to reflect changes
    updateCartUI();
}

// Function to remove an item from the wishlist
function removeWishlistItem(productId) {
    // Retrieve cart items from local storage
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Filter out the item to be removed
    wishlistItems = wishlistItems.filter(item => item.productId !== productId);

    // Update local storage with updated wishlist items
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));

    // Update the wishlist UI to reflect changes
    updateWishlistUI();
}
function removeMessage() {
    setTimeout(() => {
        message.style.transform = "translate(-120%)";
        cartItemNumber = 0;
    }, 2000)
}