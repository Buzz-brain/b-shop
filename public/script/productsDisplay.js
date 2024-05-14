let products = [
                    {
                        id: 1,
                        productImage: "/products/jumbotronOne.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    },
                    {
                        id: 2,
                        productImage: "/products/jumbotronTwo.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    },
                    {
                        id: 3,
                        productImage: "/products/jumbotronThree.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    },
                    {
                        id: 4,
                        productImage: "/products/jumbotronFour.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    },
                    {
                        id: 5,
                        productImage: "/products/jumbotronFour.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    },
                    {
                        id: 6,
                        productImage: "/products/jumbotronFour.png",
                        productName: "Black and white",
                        brandName: "Puma",
                        rating: "4.7",
                        delPrice: "40.00",
                        price: "35.46",
                    }
]
// Display products
let productsSection = document.getElementById("productsSection");
for (i = 0; i < products.length; i++) {
    let product = document.createElement("div");
    product.innerHTML = 
    `<div id="productsSection" class="productsSection">
        <div class="productCtn" id = "${products[i].id}">
            <div class="productCtnOne">
                <div class="productImg">
                    <img src="${products[i].productImage}" alt="">
                </div>
            </div>

            <div class="productCtnTwo">
                <p class="productName">${products[i].productName}</p>
                <p class="brandName">${products[i].brandName}</p>
                <div class="ratingCtn">
                    <img src="/css/icons/star.png" alt="rating icon"> 
                    <p class="rating">${products[i].rating}</p>
                </div>
                <div class="priceCtn">
                    <p class="delPrice">$<del>${products[i].delPrice}</del></p>
                    <p class="price">$${products[i].price}</p>
                </div>
            </div>
        </div>
    </div>`
    productsSection.append(product)
}


