// REQUIRE MODULES
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = require('mongodb').ObjectId; 
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;

// CONFIGURATION SETTING
const server = express();
dotenv.config()

// Configure multer for file upload
const upload = multer({ dest: '/tmp/' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'df2q6gyuq',
    api_key: '259936754944698',
    api_secret: 'bTfV4_taJPd1zxxk1KJADTL8JdU'
  });


//CONNECT MONGODB
const _conn = new mongodb.MongoClient(process.env.DB_URL)

// USE SERVER
server.use(express.static(path.join(__dirname, "public")));
server.use(bodyParser.urlencoded({ extended:false }));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.json());

// SET ENGINE
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views")); // Set views directory

// REASSIGN ENV DETAILS
const tbname = process.env.TABLE
const dbname = process.env.DB_NAME


// ----------------------- GET ALL ROUTE STARTS --------------------------------
// ----------------------- GET ALL ROUTE STARTS --------------------------------

server.get("/", async (req, res) => {
    // Fetch all products from the database
    const products = await _conn.db(dbname).collection("products").find().toArray();
    res.render("index", { products: products });
});

//---------- GET 404 ROUTE ----------------
server.get("/404", (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    res.render("404"); // Render the 404 page
});

//---------- GET ABOUT ROUTE ----------------
server.get("/about", (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    res.render("about"); // Render the about page
});

//---------- GET CART ROUTE ----------------
server.get("/cart", (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    res.render("cart"); // Render the cart page
});


//---------- GET CONTACT ROUTE ----------------
server.get("/contact", (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    res.render("contact"); // Render the contact page
});

//---------- GET PRODUCTS ROUTE ----------------
server.get("/products", async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    // Fetch all products from the database
    const products = await _conn.db(dbname).collection("products").find().toArray();
    if (products) {
        // If products exist, render the products page with the products data
        res.render("products", { products: products });
    } else {
        // If products not found, send a 401 status and a message
        res.status(401).send({
            message: "Products not found"
        });
    }
});

//---------- GET ADD PRODUCT ROUTE ----------------
server.get("/addProduct", (req, res) => {
    userNotLoggedIn(req, res); //Check if user is logged in
    res.render("addProduct"); //Render the addProduct page
});

//---------- GET PRODUCT DETAILS ROUTE ----------------
server.get('/productDetails/:productId', async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    const productId = req.params.productId;
    // Fetch product details based on productId
    const product = await _conn.db(dbname).collection("products").findOne({ _id: new ObjectID(productId) });
    if (!product) {
        // If product not found, send a 404 status
        return res.status(404).send('Product not found');
    }
    // Render the product details page with the product data
    res.render('productDetails', { product: product });
});

//---------- GET WISHLIST ROUTE ----------------
server.get("/wishlist", (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    res.render("wishlist"); // Render the wishlist page
});

//---------- GET ACCOUNT ROUTE ----------------
server.get("/account", async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_user;
        // Query the database to find the user by password
        const user = await _conn.db(dbname).collection(tbname).findOne({ password });
        if (user) {
            // If user found, render the account page with the user's data
            return res.render("account", { user: user });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
    }
});

//----------  GET ADMIN PROFILE ROUTE ----------------
server.get("/adminProfile", async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_admin;
        // Query the database to find the admin by password
        const admin = await _conn.db(dbname).collection("admin").findOne({ password });
        if (admin) {
            // If admin found, render the admin profile page with the admin's data
            res.render("adminProfile", { admin: admin });
        }
    } catch (error) {
        console.error("Error authenticating admin:", error);
    }
});

//---------- GET CHECKOUT ROUTE ----------------
server.get("/checkout", async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_user;
        // Query the database to find the user by password
        const user = await _conn.db(dbname).collection(tbname).findOne({ password });
        const userBillingDetails = await _conn.db(dbname).collection("billingDetails").findOne({ userId: user._id });
        if (user) {
            if (userBillingDetails) {
                // If user and billing details found, render the checkout page with the user's billing details
                return res.render("checkout", { user: userBillingDetails });
            }
            // If user found but no billing details, render the checkout page with the user's data
            return res.render("checkout", { user: user });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
    }
});

//---------- GET HOME ROUTE ----------------
// server.get("/", async (req, res) => {
//     userNotLoggedIn(req, res); // Check if user is logged in
//     // Fetch all products from the database
//     const products = await _conn.db(dbname).collection("products").find().toArray();
//     if (products) {
//         // If products exist, render the home page with the products data
//         res.render("index", { products: products });
//     } else {
//         // If products not found, send a 401 status and redirect to the login page
//         res.status(401).send({
//             message: "Products not found"
//         });
//         res.redirect("/login");
//     }
// });






//---------- GET EDIT USER PROFILE ROUTE ----------------
server.get('/edit/:id', async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    const userId = req.params.id;
    // Fetch user details based on userId
    const user = await _conn.db(dbname).collection(tbname).findOne({ _id: new ObjectID(userId) });
    const admin = await _conn.db(dbname).collection("admin").find().toArray();
    if (!user) {
        // If user not found, send a 404 status
        return res.status(404).send("User not found");
    }
    // Render the edit profile page with the user's data
    res.render('edit', { user: user, admin: admin });
});

//---------- GET EDIT PRODUCT DETAILS ROUTE ----------------
server.get('/editProduct/:id', async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    const productId = req.params.id;
    // Fetch product details based on productId
    const product = await _conn.db(dbname).collection("products").findOne({ _id: new ObjectID(productId) });
    if (!product) {
        // If product not found, send a 404 status
        return res.status(404).send("Product not found");
    }
    // Render the edit product page with the product's data
    res.render('editProduct', { product: product });
});

//---------- GET ADMIN LOGIN ROUTE ----------------
server.get("/adminLogin", async (req, res) => {
    adminNotLoggedIn(req, res); // Check if admin is logged in
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_admin;
        // Query the database to find the admin by password
        const adminPassword = await _conn.db(dbname).collection("admin").findOne({ password });
        if (adminPassword) {
            // If admin found, render the admin dashboard with feedback and admin data
            const admin = await _conn.db(dbname).collection("admin").find().toArray();
            const users = await _conn.db(dbname).collection("users").find().toArray();
            return res.render("dashboard", { feedback: users, admin: admin });
        }
    } catch (error) {
        console.error("Error authenticating admin:", error);
    }
});

//---------- GET USER LOGIN ROUTE ----------------
server.get("/login", async (req, res) => {
    userNotLoggedIn(req, res); // Check if user is logged in
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_user;
        // Query the database to find the user by password
        const user = await _conn.db(dbname).collection(tbname).findOne({ password });
        if (user) {
            // If user found, render the home page with products data
            const products = await _conn.db(dbname).collection("products").find().toArray();
            return res.render("index", { products: products });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.render("login"); // Render the login page if there's an error
    }
});

//---------- GET USER SIGNUP ROUTE ----------------
server.get("/signup", (req, res) => {
    res.render("signup"); // Render the signup page
});


//---------- GET ADMIN SIGNUP ROUTE (HIDDEN) ----------------
// server.get("/adminSignup", (req, res) => {
//     res.render("adminSignup"); // Render the admin signup page (hidden)
// });

// ----------------------- GET ALL ROUTE ENDS --------------------------------
// ----------------------- GET ALL ROUTE ENDS --------------------------------




// ----------------------- CREATE OPERATION STARTS --------------------------------
// ----------------------- CREATE OPERATION STARTS --------------------------------

// CREATE / REGISTER A USER
server.post("/signup", async (req, res) => {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create user data object with hashed password
    const data = {
        firstname: req.body.firstname,
        username: req.body.username,
        lastname: "",
        email: req.body.email,
        password: hashedPassword,
        address: ""
    };

    // Check if email and password are provided
    if (data.email.length > 0 && data.password.length > 0) {
        // Check if the email already exists in the database
        const existingEmail = await _conn.db(dbname).collection(tbname).findOne({ email: data.email });
        if (existingEmail) {
            // If email exists, send a message to choose a different email
            res.send("Email already exists. Please choose a different email");
        } else {
            // If email does not exist, insert the user data into the database
            const userdata = await _conn.db(dbname).collection(tbname).insertOne(data);
            if (userdata) {
                // If user data is successfully inserted, redirect to the login page
                res.redirect("/login");
            } else {
                // If unable to register, send a 401 status with a message
                res.status(401).send({
                    message: "Unable to register"
                });
            }
        }
    } else {
        // If email and password are not provided, send a message indicating all fields are required
        res.send("All fields are required");
    }
});

// CREATE / REGISTER AN ADMIN
server.post("/adminSignup", async (req, res) => {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create admin data object with hashed password
    const data = {
        firstname: req.body.firstname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    };

    // Check if email and password are provided
    if (data.email.length > 0 && data.password.length > 0) {
        // Check if the email already exists in the admin collection
        const existingEmail = await _conn.db(dbname).collection("admin").findOne({ email: data.email });
        if (existingEmail) {
            // If email exists, send a message to choose a different email
            res.send("Email already exists. Please choose a different email");
        } else {
            // If email does not exist, insert the admin data into the admin collection
            const userdata = await _conn.db(dbname).collection("admin").insertOne(data);
            if (userdata) {
                // If admin data is successfully inserted, redirect to the admin login page
                res.redirect("/adminLogin");
            } else {
                // If unable to signup, send a 401 status with a message
                res.status(401).send({
                    message: "Unable to signup"
                });
            }
        }
    } else {
        // If email and password are not provided, send a message indicating all fields are required
        res.send("All fields are required");
    }
});


// Route for uploading product image
server.post('/upload', upload.single("image"), async (req, res) => {
    try {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Create product with Cloudinary URL
        const { productName, brandName, category, description, rating, delPrice, currentPrice } = req.body;
        const product_data = {
            productName: productName,
            brandName: brandName,
            rating: rating,
            category: category,
            description: description,
            delPrice: delPrice,
            currentPrice: currentPrice,
            imageURL: result.secure_url // Store Cloudinary URL in database
        };
        
        // Insert product data into the database
        const feedback = await _conn.db(dbname).collection("products").insertOne(product_data);
        if (feedback) {
            // If product data is successfully inserted, redirect to products display page
            res.redirect("productsDisplay");
        } else {
            // If unable to add product, send a 401 status with a message
            res.status(401).send({
                message: "Unable to add product"
            });
        }
    } catch (error) {
        // If an error occurs during the process, log the error and send a 500 status with a message
        console.error('Error uploading product image:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission to save billing details
server.post('/saveBillingDetails', async (req, res) => {
    const password = req.cookies.reg_user;
    // Query the database to find the user by password
    const user = await _conn.db(dbname).collection(tbname).findOne({ password });
    if (user) {
        try {
            const billingDetails = {
                userId: user._id,
                firstname: req.body.firstname,
                companyName: req.body.companyName,
                apartment: req.body.apartment,
                town: req.body.town,
                email: req.body.emailAddress,
                phoneNumber: req.body.phoneNumber,
                streetAddress: req.body.streetAddress
            };

            // Check if billing details already exist for the user
            const existingDetails = await _conn.db(dbname).collection("billingDetails").findOne({ userId: user._id });

            if (existingDetails) {
                // Update existing billing details
                await _conn.db(dbname).collection("billingDetails").updateOne({ userId: user._id }, { $set: billingDetails });
                res.redirect("checkout");
            } else {
                // Insert new billing details
                await _conn.db(dbname).collection("billingDetails").insertOne(billingDetails);
                res.redirect("checkout");
            }
        } catch (error) {
            // If an error occurs during the process, log the error and send a 500 status with a message
            console.error('Error saving billing details:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        // If user not found, redirect to checkout page
        res.redirect("checkout");
    }
});

// ----------------------- CREATE OPERATION ENDS --------------------------------
// ----------------------- CREATE OPERATION ENDS --------------------------------




// ----------------------- READ OPERATION STARTS --------------------------------
// ----------------------- READ OPERATION STARTS --------------------------------

// READ / DISPLAY ALL REGISTERED USERS ON ADMIN DASHBOARD
server.get("/users", async (req, res) => {
    // Fetch all registered users from the database
    const feedback = await _conn.db(dbname).collection(tbname).find().toArray();
    // Fetch admin details from the database
    const admin = await _conn.db(dbname).collection("admin").findOne();
    if (feedback) {
        // If users are found, render the dashboard page with user feedback and admin data
        res.render("dashboard", { feedback: feedback, admin: admin });
    } else {
        // If users not found, send a 401 status with a message
        res.status(401).send({ message: "Users not found" });
    }
});

// READ / DISPLAY PRODUCT FROM THE DATABASE ON USER END AND ADMIN DASHBOARD
server.get("/productsDisplay", async (req, res) => {
    // Fetch all products from the database
    const products = await _conn.db(dbname).collection("products").find().toArray();
    // Fetch admin details from the database
    const admin = await _conn.db(dbname).collection("admin").findOne();
    if (products) {
        // If products are found, render the products display page with product data and admin data
        res.render("productsDisplay", { products: products, admin: admin });
    } else {
        // If products not found, send a 401 status with a message
        res.status(401).send({ message: "Product not found" });
    }
});

// SEARCH / DISPLAY SEARCHED USER BY ADMIN ON ADMIN DASHBOARD
server.post('/search', async (req, res) => {
    // Fetch admin details from the database
    const admin = await _conn.db(dbname).collection("admin").findOne();
    // Extract the search query from the request body
    const searchQuery = req.body.search;
    try {
        // Search for users in the database based on the search query
        const searchResults = await _conn.db(dbname).collection(tbname).find({
            $or: [
                // Case-insensitive search by first name, last name, username, or email
                { firstname: { $regex: searchQuery, $options: 'i' } },
                { lastname: { $regex: searchQuery, $options: 'i' } },
                { username: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();
        // Render the dashboard page with the search results and admin data
        res.render('dashboard', { feedback: searchResults, admin: admin });
    } catch (err) {
        // If an error occurs during the search process, log the error and send a 500 status with a message
        console.error(err);
        res.status(500).send("Error searching users");
    }
});

// SEARCH / DISPLAY SEARCHED PRODUCT BY ADMIN ON ADMIN DASHBOARD
server.post('/admin/searchProduct', async (req, res) => {
    // Fetch admin details from the database
    const admin = await _conn.db(dbname).collection("admin").findOne();
    // Extract the search query and category query from the request body
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        if (searchQuery) {
            // Search for products in the database based on the search query
            const searchResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    // Case-insensitive search by product name, brand name, category, description, rating, or current price
                    { productName: { $regex: searchQuery, $options: 'i' } },
                    { brandName: { $regex: searchQuery, $options: 'i' } },
                    { category: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { rating: { $regex: searchQuery, $options: 'i' } },
                    { currentPrice: { $regex: searchQuery, $options: 'i' } }
                ]
            }).toArray();
            // Render the products display page with the search results and admin data
            res.render('productsDisplay', { products: searchResults, admin: admin });
        } else if (categoryQuery) {
            // Search for products in the database based on the category query
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    // Case-insensitive search by category name
                    { category: { $regex: categoryQuery, $options: 'i' } }
                ]
            }).toArray();
            // Render the products display page with the category results and admin data
            res.render('productsDisplay', { products: categoryResults, admin: admin });
        } else {
            // If neither search query nor category query is provided, render the products display page with all products and admin data
            const allProducts = await _conn.db(dbname).collection("products").find().toArray();
            res.render('productsDisplay', { products: allProducts, admin: admin });
        }
    } catch (err) {
        // If an error occurs during the search process, log the error and send a 500 status with a message
        console.error(err);
        res.status(500).send("Error searching product");
    }
});


// SEARCH / DISPLAY SEARCHED PRODUCT BY USER ON HOMEPAGE
server.post('/searchProducts', async (req, res) => {
    // Extract the search query and category query from the request body
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        // Search for products in the database based on the search query or category query
        const searchResults = await _conn.db(dbname).collection("products").find({
            $or: [
                // Case-insensitive search by product name, brand name, category, description, rating, or current price
                { productName: { $regex: searchQuery, $options: 'i' } }, 
                { brandName: { $regex: searchQuery, $options: 'i' } }, 
                { category: { $regex: searchQuery, $options: 'i' } }, 
                { description: { $regex: searchQuery, $options: 'i' } }, 
                { rating: { $regex: searchQuery, $options: 'i' } },
                { currentPrice: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();

        if (searchQuery) {
            // If a search query is provided, render the homepage with the search results
            res.render('index', { products: searchResults });
        } else if (categoryQuery) {
            // If a category query is provided, search for products by category and render the homepage with the category results
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    // Case-insensitive search by category name
                    { category: { $regex: categoryQuery, $options: 'i' } }, 
                ]
            }).toArray();
            res.render('index', { products: categoryResults });
        } else {
            // If neither search query nor category query is provided, render the homepage with all products
            res.render('index', { products: searchResults });
        }
    } catch (err) {
        // If an error occurs during the search process, log the error and send a 500 status with a message
        console.error(err);
        res.status(500).send("Error searching product");
    }
});

// SEARCH / DISPLAY SEARCHED PRODUCT BY USER ON PRODUCT PAGE
server.post('/searchforproducts', async (req, res) => {
    // Extract the search query and category query from the request body
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        // Search for products in the database based on the search query or category query
        const searchResults = await _conn.db(dbname).collection("products").find({
            $or: [
                // Case-insensitive search by product name, brand name, category, description, rating, or current price
                { productName: { $regex: searchQuery, $options: 'i' } }, 
                { brandName: { $regex: searchQuery, $options: 'i' } }, 
                { category: { $regex: searchQuery, $options: 'i' } }, 
                { description: { $regex: searchQuery, $options: 'i' } }, 
                { rating: { $regex: searchQuery, $options: 'i' } },
                { currentPrice: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();

        if (searchQuery) {
            // If a search query is provided, render the product page with the search results
            res.render('products', { products: searchResults });
        } else if (categoryQuery) {
            // If a category query is provided, search for products by category and render the product page with the category results
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    // Case-insensitive search by category name
                    { category: { $regex: categoryQuery, $options: 'i' } }, 
                ]
            }).toArray();
            res.render('products', { products: categoryResults });
        } else {
            // If neither search query nor category query is provided, render the product page with all products
            res.render('products', { products: searchResults });
        }
    } catch (err) {
        // If an error occurs during the search process, log the error and send a 500 status with a message
        console.error(err);
        res.status(500).send("Error searching product");
    }
});


// ----------------------- READ OPERATION ENDS --------------------------------
// ----------------------- READ OPERATION ENDS --------------------------------




// ----------------------- UPDATE OPERATION STARTS --------------------------------
// ----------------------- UPDATE OPERATION STARTS --------------------------------

// // UPDATE ADMIN PROFILE
// server.post("/updateAdminProfile/:id", async (req, res) => {
//     // Extract adminId from request parameters
//     const adminId = req.params.id;
//     // Extract necessary fields from request body
//     const { firstname, lastname, email, address, username } = req.body;
//     try {
//       if (req.file) {
//         // If there is a file (image) attached in the request, upload it to Cloudinary
//         const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
//         // Update admin profile with the new image URL
//         const result = await _conn.db(dbname).collection("admin").updateOne({ _id: new ObjectID(adminId) },
//             {
//               $set: {
//                 firstname: firstname,
//                 lastname: lastname,
//                 username: username,
//                 email: email,
//                 address: address,
//                 imageURL: resultImageUrl.secure_url, // Update image URL
//               },
//             }
//           );
//         if (!result) {
//           return res.status(404).send("Admin not found");
//         }
//       } else {
//         // If no file (image) attached in the request, update admin profile without image
//         const result = await _conn.db(dbname).collection("admin").updateOne({ _id: new ObjectID(adminId) },
//             {
//               $set: {
//                 firstname: firstname,
//                 lastname: lastname,
//                 username: username,
//                 email: email,
//                 address: address,
//               },
//             }
//           );
//         if (!result) {
//           return res.status(404).send("Admin not found");
//         }
//       }
//       // Redirect to the admin profile page after successful update
//       res.redirect("/adminProfile");
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error updating admin");
//     }
//   });
  
// // UPDATE USER PROFILE
// server.post('/update/:id', async (req, res) => {
//     // Extract userId from request parameters
//     const userId = req.params.id;
//     // Extract necessary fields from request body
//     const { firstname, lastname, email, address, username } = req.body;
//     try {
//         if (req.file) {
//             // If there is a file (image) attached in the request, upload it to Cloudinary
//             const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
//             // Update user profile with the new image URL
//             const result = await _conn.db(dbname).collection(tbname).updateOne(
//                 { _id: new ObjectID(userId) },
//                 { $set: { 
//                     firstname: firstname, 
//                     lastname: lastname, 
//                     username: username, 
//                     email: email, 
//                     address: address, 
//                     imageURL: resultImageUrl.secure_url 
//                 }}
//             );
//             if (!result) {
//                 return res.status(404).send("User not found");
//             } 
//         } else {
//             // If no file (image) attached in the request, update user profile without image
//             const result = await _conn.db(dbname).collection(tbname).updateOne(
//                 { _id: new ObjectID(userId) },
//                 { $set: { 
//                     firstname: firstname, 
//                     lastname: lastname, 
//                     username: username, 
//                     email: email, 
//                     address: address 
//                 }}
//             );
//             if (!result) {
//                 return res.status(404).send("User not found");
//             } 
//         }
//         // Redirect to the user account page after successful update
//         res.redirect("/account")

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error updating user");
//     }
// });
  
//   // UPDATE PRODUCT DETAILS
// server.post('/updateProduct/:id', async (req, res) => {
//     // Extract productId from request parameters
//     const productId = req.params.id;
//     // Extract necessary fields from request body
//     const { productName, brandName, description,  rating, delPrice, currentPrice, category } = req.body;
//     console.log(req.body.category)
//     try {
//         if (req.file) {
//             // If there is a file (image) attached in the request, upload it to Cloudinary
//             const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
//             // Update product details with the new image URL
//             const result = await _conn.db(dbname).collection("products").updateOne(
//                 { _id: new ObjectID(productId) },
//                 { $set: { 
//                     productName: productName,
//                     category: category,
//                     brandName: brandName,
//                     description: description,
//                     rating: rating,
//                     delPrice: delPrice,
//                     currentPrice: currentPrice,
//                     imageURL: resultImageUrl.secure_url 
//                 }}
//             );
//             if (!result) {
//                 return res.status(404).send("Product not found");
//             } 
//         } else {
//             // If no file (image) attached in the request, update product details without image
//             const result = await _conn.db(dbname).collection("products").updateOne(
//                 { _id: new ObjectID(productId) },
//                 { $set: { 
//                     productName: productName,
//                     brandName: brandName,
//                     category: category,
//                     description: description,
//                     rating: rating,
//                     delPrice: delPrice,
//                     currentPrice: currentPrice 
//                 }}
//             );
//             if (!result) {
//                 return res.status(404).send("Product not found");
//             } 
//         }
//         // Redirect back to the list of products after successful update
//         res.redirect('/productsDisplay'); 
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error updating product");
//     }
// });
  
server.post("/updateAdminProfile/:id", upload.single("image"), async (req, res) => {
    const adminId = req.params.id;
    const { firstname, lastname, email, address, username } = req.body;
    try {
      if (req.file) {
        // Upload image to Cloudinary
        const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
        const result = await _conn
          .db(dbname)
          .collection("admin")
          .updateOne(
            { _id: new ObjectID(adminId) },
            {
              $set: {
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                address: address,
                imageURL: resultImageUrl.secure_url,
              },
            }
          );
        if (!result) {
          return res.status(404).send("Admin not found");
        }
      } else {
        const result = await _conn
          .db(dbname)
          .collection("admin")
          .updateOne(
            { _id: new ObjectID(adminId) },
            {
              $set: {
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                address: address,
              },
            }
          );
        if (!result) {
          return res.status(404).send("Admin not found");
        }
      }
      res.redirect("/adminProfile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating admin");
    }
  });
  
  // UPDATE USER PROFILE
  server.post('/update/:id', upload.single("image"), async (req, res) => {
      const userId = req.params.id;
      const { firstname, lastname, email, address, username } = req.body;
    console.log(req.body)
    console.log(req.file)


      try {
          if (req.file) {
              // Upload image to Cloudinary
              const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
              const result = await _conn.db(dbname).collection(tbname).updateOne(
                  { _id: new ObjectID(userId) },
                  { $set: { firstname: firstname, lastname: lastname, username: username, email: email, address: address, imageURL: resultImageUrl.secure_url }}
              );
              if (!result) {
                  return res.status(404).send("User not found");
              } 
          } else {
              const result = await _conn.db(dbname).collection(tbname).updateOne(
                  { _id: new ObjectID(userId) },
                  { $set: { firstname: firstname, lastname: lastname, username: username, email: email, address: address }}
              );
              if (!result) {
                  return res.status(404).send("User not found");
              } 
          }
          res.redirect("/account")
  
      } catch (err) {
          console.error(err);
          res.status(500).send("Error updating user");
      }
  });
  
  // UPDATE PRODUCT DETAILS
  server.post('/updateProduct/:id', upload.single("image"), async (req, res) => {
      const productId = req.params.id;
      const { productName, brandName, description,  rating, delPrice, currentPrice, category } = req.body;
      try {
          if (req.file) {
              // Upload image to Cloudinary
              const resultImageUrl = await cloudinary.uploader.upload(req.file.path);
              const result = await _conn.db(dbname).collection("products").updateOne(
                  { _id: new ObjectID(productId) },
                  { $set: { 
                      productName: productName,
                      category: category,
                      brandName: brandName,
                      description: description,
                      rating: rating,
                      delPrice: delPrice,
                      currentPrice: currentPrice,
                      imageURL: resultImageUrl.secure_url 
                  }}
              );
              if (!result) {
                  return res.status(404).send("Product not found");
              } 
          } else {
              const result = await _conn.db(dbname).collection("products").updateOne(
                  { _id: new ObjectID(productId) },
                  { $set: { 
                      productName: productName,
                      brandName: brandName,
                      category: category,
                      description: description,
                      rating: rating,
                      delPrice: delPrice,
                      currentPrice: currentPrice 
                  }}
              );
              if (!result) {
                  return res.status(404).send("Product not found");
              } 
          }
          res.redirect('/productsDisplay'); // Redirect back to the list of products
      } catch (err) {
          console.error(err);
          res.status(500).send("Error updating product");
      }
  });
// ----------------------- UPDATE OPERATION ENDS --------------------------------
// ----------------------- UPDATE OPERATION ENDS --------------------------------




// ----------------------- DELETE OPERATION STARTS --------------------------------
// ----------------------- DELETE OPERATION STARTS --------------------------------

// DELETE USER
server.post('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await _conn.db(dbname).collection(tbname).deleteOne({ _id: new ObjectID(userId) });
        if (!result) {
            return res.status(404).send("User not found");
        }
        res.redirect('/users'); // Redirect back to the list of users
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
});

// DELETE PRODUCT
server.post('/deleteProduct/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await _conn.db(dbname).collection("products").deleteOne({ _id: new ObjectID(productId) });
        if (!result) {
            return res.status(404).send("Product not found");
        }
        res.redirect('/productsDisplay'); // Redirect back to the list of products
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});


// ----------------------- DELETE OPERATION ENDS --------------------------------
// ----------------------- DELETE OPERATION ENDS --------------------------------




// ----------------------- LOGIN / LOGOUT OPERATION STARTS --------------------------------
// ----------------------- LOGIN / LOGOUT OPERATION STARTS --------------------------------

// LOGIN ADMIN
server.post("/adminLogin", async function(req, res) {
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    if (data.email.length > 0 && data.password.length > 0) {
        try {
            const check = await _conn.db(dbname).collection("admin").findOne({ email: data.email });

            if (!check) {
                return res.send("Invalid Email");
            }

            const isPasswordMatch = await bcrypt.compare(data.password, check.password);

            if (!isPasswordMatch) {
                return res.send("Incorrect Password");
            }

            const admin = await _conn.db(dbname).collection("admin").find().toArray();
            const users = await _conn.db(dbname).collection("users").find().toArray()
            
            res.cookie("reg_admin", check.password, { secure: true, httpOnly: true });
            res.render("dashboard", {feedback : users, admin: admin});

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Internal Server Error");
        }
    } 
    else {
        res.send("All Fields are required");
    }
})

// LOGIN USER
server.post("/login", async function(req, res) {
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    if (data.email.length > 0 && data.password.length > 0) {
        try {
            const check = await _conn.db(dbname).collection(tbname).findOne({ email: data.email });

            if (!check) {
                return res.status(401).json({ message: "Invalid Login details" });
            }

            const isPasswordMatch = await bcrypt.compare(data.password, check.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Invalid Login details" });
            }

            const products = await _conn.db(dbname).collection("products").find().toArray();
            res.cookie("reg_user", check.password, { secure: true, httpOnly: true });
            return res.status(200).json({ message: "Login Successful"});
        } catch (error) {
            console.error("Login error:", error);  // Log any unexpected errors
            res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        res.status(400).json({ message: "All Fields are required" });
    }
});

// LOGOUT USER
server.get("/user/logout", function(req, res) {
    res.clearCookie("reg_user")
    res.redirect("/login")
})

// LOGOUT ADMIN
server.get("/admin/logout", function(req, res) {
    res.clearCookie("reg_admin")
    res.redirect("/adminLogin")
})

// ----------------------- LOGIN / LOGOUT OPERATION ENDS --------------------------------
// ----------------------- LOGIN / LOGOUT OPERATION ENDS --------------------------------




// ----------------------- LOGIN AUTHENTICATION STARTS --------------------------------
// ----------------------- LOGIN AUTHENTICATION STARTS --------------------------------

function userNotLoggedIn(req, res) {
    if (!req.cookies.reg_user) {
        res.render("login")
    }
}
function adminNotLoggedIn(req, res) {
    if (!req.cookies.reg_admin) {
        res.render("adminLogin")
    }
}

// ----------------------- LOGIN AUTHENTICATION ENDS --------------------------------
// ----------------------- LOGIN AUTHENTICATION ENDS --------------------------------




// ----------------------- PAYMENT OPERATION STARTS --------------------------------
// ----------------------- PAYMENT OPERATION STARTS --------------------------------

server.post("/checkout", async (req, res) => {
    // Import the Paystack library and initialize it with the secret key
    const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    
    // Extract necessary information from the request body
    const { cardNumber, expiryDate, cvv, amount, email, phoneNumber } = req.body;

    try {
        // Initialize a transaction with Paystack
        const response = await paystack.transaction.initialize({
            amount: parseInt(amount) * 100, // Convert amount to kobo (Paystack requires amount in kobo)
            email: email,
            metadata: {
                phoneNumber: phoneNumber,
            }
        });
        
        // If payment was initialized successfully, redirect the user to the authorization URL
        res.redirect(response.data.authorization_url);
        
        // Log the transaction reference
        console.log(response.data.reference);
    } catch (error) {
        // Handle errors encountered during payment processing
        console.error("Error processing payment:", error);
        res.status(500).send("Error processing payment");
    }
});


// ----------------------- PAYMENT OPERATION ENDS --------------------------------
// ----------------------- PAYMENT OPERATION ENDS --------------------------------




// LISTEN TO PORT
server.listen(process.env.PORT, function(error) {
    if(error) {
        console.log("unable to connect");
    } 
    else {
        console.log("server is listening on port 2000")
    }
})