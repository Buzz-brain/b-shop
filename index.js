// REQUIRE MODULES
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = require('mongodb').ObjectId; 
const path = require("path");
const dotenv = require("dotenv");
const {log} = require("console");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary').v2;


// CONFIGURATION SETTING
const server = express();
dotenv.config()
// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });
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
server.set("view engine", "ejs")

// REASSIGN ENV DETAILS
const tbname = process.env.TABLE
const dbname = process.env.DB_NAME


// ----------------------- GET ALL ROUTE STARTS --------------------------------
// ----------------------- GET ALL ROUTE STARTS --------------------------------

//---------- GET 404 ROUTE ----------------
server.get("/404", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("404");
});

//---------- GET ABOUT ROUTE ----------------
server.get("/about", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("about");
});

//---------- GET CART ROUTE ----------------
server.get("/cart", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("cart");
});

//---------- GET CHECKOUT ROUTE ----------------
server.get("/checkout", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("checkout");
});

//---------- GET CONTACT ROUTE ----------------
server.get("/contact", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("contact");
});

//---------- GET PRODUCTS ROUTE ----------------
server.get("/products", async (req, res) => {
    userNotLoggedIn(req, res)
    const products = await _conn.db(dbname).collection("products").find().toArray()
    if (products) {        
        res.render("products", {products: products})
    } else {
        res.status(401).send({
            message: "Products not found"
        })
    }
});

//---------- GET ADD PRODUCT ROUTE ----------------
server.get("/addProduct", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("addProduct")
})

//---------- GET PRODUCT DETAILS ROUTE ----------------
server.get('/productDetails/:productId', async (req, res) => {
    userNotLoggedIn(req, res)
    const productId = req.params.productId;
    // Here, you would fetch the product details from your database based on the productId
    const product = await _conn.db(dbname).collection("products").findOne({ _id: new ObjectID(productId) });
    if (!product) {
        // If product with the given ID is not found, handle the error
        return res.status(404).send('Product not found');
    }
    // Render the product details page and pass the product data to the template
    res.render('productDetails', { product : product });
    // Then, render the product details page and pass the product data to the template
});

//---------- GET WISHLIST ROUTE ----------------
server.get("/wishlist", (req, res) => {
    userNotLoggedIn(req, res)
    res.render("wishlist");
});

//---------- GET ACCOUNT ROUTE ----------------
server.get("/account", async (req, res) => {
    userNotLoggedIn(req, res)
    // If cookies is set render the account page else redirect to the login page
         // Decrypt the password from the cookie
         const password = req.cookies.reg_user;
         // Query the database to find the user by password
         const user = await _conn.db(dbname).collection(tbname).findOne({ password });
         if (user) {
             // User found, render the page with the user's name
             return res.render("account", { user : user });
         }
});

//---------- GET HOME ROUTE ----------------
server.get("/", async (req, res) => {
    userNotLoggedIn(req, res)
    const products = await _conn.db(dbname).collection("products").find().toArray()
    if (products) {        
        res.render("index", {products: products})
    } else {
        res.status(401).send({
            message: "Products not found"
        })
        res.redirect("/login")
    }
})

//----------  GET ADMIN PROFILE ROUTE ----------------
server.get("/adminProfile", async (req, res) => {
    userNotLoggedIn(req, res)
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    res.render("adminProfile", {admin : admin})
})

//---------- GET EDIT USER PROFILE ROUTE ----------------
server.get('/edit/:id', async (req, res) => {
    userNotLoggedIn(req, res)
    const userId = req.params.id;
    const user = await _conn.db(dbname).collection(tbname).findOne({ _id: new ObjectID(userId) });
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render('edit', { user: user, admin: admin });
});

//---------- GET EDIT PRODUCT DETAILS ROUTE ----------------
server.get('/editProduct/:id', async (req, res) => {
    userNotLoggedIn(req, res)
    const productId = req.params.id;
    const product = await _conn.db(dbname).collection("products").findOne({ _id: new ObjectID(productId) });
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.render('editProduct', { product: product });
});

//---------- GET ADMIN LOGIN ROUTE ----------------
server.get("/adminLogin", async(req, res) => {
    adminNotLoggedIn(req, res)
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_admin;
        // Query the database to find the user by password
        const adminPassword = await _conn.db(dbname).collection("admin").findOne({ password });
        if (adminPassword) {
            const admin = await _conn.db(dbname).collection("admin").find().toArray();
            const users = await _conn.db(dbname).collection("users").find().toArray()
            return res.render("dashboard", {feedback : users, admin: admin});
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
    }
})

//---------- GET USER LOGIN ROUTE ----------------
server.get("/login", async (req, res) => {
    userNotLoggedIn(req, res)
    // Check if the reg_user cookie exists
    // if (req.cookies.reg_user) {
    try {
        // Decrypt the password from the cookie
        const password = req.cookies.reg_user;
        // Query the database to find the user by password
        const user = await _conn.db(dbname).collection(tbname).findOne({ password });
        if (user) {
            // User found, proceed with rendering the dashboard or home page
            const products = await _conn.db(dbname).collection("products").find().toArray();
            return res.render("index", { products : products });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
    }
    // } else {
        // res.render("login");
    // }
});

//---------- GET USER SIGNUP ROUTE ----------------
server.get("/signup", (req, res) => {
    res.render("signup");
});

//---------- GET ADMIN SIGNUP ROUTE (HIDDEN) ----------------
// server.get("/adminSignup", (req, res) => {
//     res.render("adminSignup")
// })

// ----------------------- GET ALL ROUTE ENDS --------------------------------
// ----------------------- GET ALL ROUTE ENDS --------------------------------




// ----------------------- CREATE OPERATION STARTS --------------------------------
// ----------------------- CREATE OPERATION STARTS --------------------------------

// CREATE / REGISTER A USER
server.post("/signup", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  
    const data = {
        firstname: req.body.firstname,
        username: req.body.username,
        lastname: "",
        email: req.body.email,
        password: hashedPassword,
        address: ""
    };
  
    if (data.email.length > 0 && data.password.length > 0) {
        const existingEmail = await _conn.db(dbname).collection(tbname).findOne({email: data.email});
        if (existingEmail) {
        res.send("Email already exists. Please choose a different email");
        } 
        else {
            const userdata = await _conn.db(dbname).collection(tbname).insertOne(data);
            if (userdata) {
                res.redirect("/login")
            } else {
                res.status(401).send({
                    message: "unable to register"
                })
            }
        }
    } else {
        res.send("All Fields are required")
    }
});

// CREATE / REGISTER AN ADMIN
server.post("/adminSignup", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  
    const data = {
        firstname: req.body.firstname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    };
  
    if (data.email.length > 0 && data.password.length > 0) {
        const existingEmail = await _conn.db(dbname).collection("admin").findOne({email: data.email});
        if (existingEmail) {
        res.send("Email already exists. Please choose a different email");
        } 
        else {
            const userdata = await _conn.db(dbname).collection("admin").insertOne(data);
            if (userdata) {
                res.redirect("/adminLogin")
            } else {
                res.status(401).send({
                    message: "unable to signup"
                })
            }
        }
    } else {
        res.send("All Fields are required")
    }
});

// const nodemailer = require('nodemailer');

// // Create a Nodemailer transporter using SMTP transport
// const transporter = nodemailer.createTransport({
//     host: 'smtp.elasticemail.com',
//     port: 2525,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'temiloluwaadegbuyi@gmail.com', // Your Elastic Email API key
//         pass: '1F0434D411BC7A158A2EB61AC6273F6784F5', // Your Elastic Email API key
//     },
// });

// // Define email options
// const mailOptions = {
//     from: 'chinomsochristian03@gmail.com',
//     to: 'michealgoodlife710@gmail.com',
//     subject: 'Test Email',
//     text: 'This is a test email from Nodemailer with Elastic Email!',
// };

// // Send email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.error('Error sending email:', error);
//     } else {
//         console.log('Email sent:', info.response);
//     }
// });


// CREATE / ADD A PRODUCT TO THE DATABASE
// server.post("/productsDisplay", async function (req, res, next)  {
//     const products = await _conn.db(dbname).collection("products").find().toArray()
//     const { productName, brandName, rating, delPrice, currentPrice, profileFile } = req.body;
//     const product_data = {
//         productName: productName,
//         brandName: brandName,
//         rating: rating,
//         delPrice: delPrice,
//         currentPrice: currentPrice,
//         profileFile: profileFile
//     }

//     const feedback = await _conn.db(dbname).collection("products").insertOne(product_data);
//     if (feedback) {
//         res.redirect("productsDisplay")
//     } else {
//         res.status(401).send({
//             message: "unable to add product"
//         })
//     }
// }) 

// Route for uploading product image
server.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
    
        // Create product with Cloudinary URL
        const { productName, brandName, rating, delPrice, currentPrice, profileFile } = req.body;
        const product_data = {
            productName: productName,
            brandName: brandName,
            rating: rating,
            delPrice: delPrice,
            currentPrice: currentPrice,
            imageURL: result.secure_url // Store Cloudinary URL in database
        }
    
        const feedback = await _conn.db(dbname).collection("products").insertOne(product_data);
        if (feedback) {
            res.redirect("productsDisplay")
        } else {
            res.status(401).send({
                message: "unable to add product"
            })
        }
    } catch (error) {
      console.error('Error uploading product image:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// ----------------------- CREATE OPERATION ENDS --------------------------------
// ----------------------- CREATE OPERATION ENDS --------------------------------




// ----------------------- READ OPERATION STARTS --------------------------------
// ----------------------- READ OPERATION STARTS --------------------------------

// READ / DISPLAY ALL REGISTERED USERS ON ADMIN DASHBOARD
server.get("/users", async (req, res) => {
    const feedback = await _conn.db(dbname).collection(tbname).find().toArray()
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    if (feedback) {
        res.render("dashboard", {feedback: feedback, admin: admin})
    } else {
        res.status(401).send({ message: "Users not found" })
    }
})

// READ / DISPLAY PRODUCT FROM THE DATABASE
server.get("/productsDisplay", async (req, res) => {
    const products = await _conn.db(dbname).collection("products").find().toArray()
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    
    if (products) {
        res.render("productsDisplay", {products: products, admin : admin})
    } else {
        res.status(401).send({
            message: "Product not found"
        })
    }
})

// SEARCH / DISPLAY SEARCHED USER BY ADMIN ON ADMIN DASHBOARD
server.post('/search', async (req, res) => {
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    const searchQuery = req.body.search;
    try {
        const searchResults = await _conn.db(dbname).collection(tbname).find({
            $or: [
                // Case-insensitive search
                { firstname: { $regex: searchQuery, $options: 'i' } }, // Search by first name 
                { lastname: { $regex: searchQuery, $options: 'i' } }, // Search by last name 
                { email: { $regex: searchQuery, $options: 'i' } } // Search by email (case-insensitive)
            ]
        }).toArray();
        res.render('dashboard', { feedback: searchResults, admin: admin });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching users");
    }
});

// SEARCH / DISPLAY SEARCHED PRODUCT BY ADMIN ON ADMIN DASHBOARD
server.post('/admin/searchProduct', async (req, res) => {
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    // const category = req.body.brandName; // Get the selected category from the request
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        const searchResults = await _conn.db(dbname).collection("products").find({
            $or: [
                // Case-insensitive search
                { productName: { $regex: searchQuery, $options: 'i' } }, 
                { brandName: { $regex: searchQuery, $options: 'i' } }, 
                { rating: { $regex: searchQuery, $options: 'i' } },
                { currentPrice: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();

        if(searchQuery) {
            res.render('productsDisplay', { products: searchResults, admin: admin});
        } 
        else if (categoryQuery) {
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    //Supposed to have a category name
                    { brandName: { $regex: categoryQuery, $options: 'i' } }, 
                ]
            }).toArray();
            res.render('productsDisplay', { products: categoryResults, admin: admin});
        } else {
            res.render('productsDisplay', { products: searchResults, admin: admin});
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching product");
    }
});

// SEARCH / DISPLAY SEARCHED PRODUCT BY USER ON HOMEPAGE
server.post('/searchProducts', async (req, res) => {
    // const category = req.body.brandName; // Get the selected category from the request
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        const searchResults = await _conn.db(dbname).collection("products").find({
            $or: [
                // Case-insensitive search
                { productName: { $regex: searchQuery, $options: 'i' } }, 
                { brandName: { $regex: searchQuery, $options: 'i' } }, 
                { rating: { $regex: searchQuery, $options: 'i' } },
                { currentPrice: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();

        if(searchQuery) {
            res.render('index', { products: searchResults});
        } 
        else if (categoryQuery) {
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    //Supposed to have a category name
                    { brandName: { $regex: categoryQuery, $options: 'i' } }, 
                ]
            }).toArray();
            res.render('index', { products: categoryResults});
        } else {
            res.render('index', { products: searchResults});
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching product");
    }
});

// SEARCH / DISPLAY SEARCHED PRODUCT BY USER ON PRODUCT PAGE
server.post('/searchforproducts', async (req, res) => {
    // const category = req.body.brandName; // Get the selected category from the request
    const searchQuery = req.body.search;
    const categoryQuery = req.body.category;
    try {
        const searchResults = await _conn.db(dbname).collection("products").find({
            $or: [
                // Case-insensitive search
                { productName: { $regex: searchQuery, $options: 'i' } }, 
                { brandName: { $regex: searchQuery, $options: 'i' } }, 
                { rating: { $regex: searchQuery, $options: 'i' } },
                { currentPrice: { $regex: searchQuery, $options: 'i' } }
            ]
        }).toArray();

        if(searchQuery) {
            res.render('products', { products: searchResults});
        } 
        else if (categoryQuery) {
            const categoryResults = await _conn.db(dbname).collection("products").find({
                $or: [
                    //Supposed to have a category name
                    { brandName: { $regex: categoryQuery, $options: 'i' } }, 
                ]
            }).toArray();
            res.render('products', { products: categoryResults});
        } else {
            res.render('products', { products: searchResults});
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching product");
    }
});

// ----------------------- READ OPERATION ENDS --------------------------------
// ----------------------- READ OPERATION ENDS --------------------------------




// ----------------------- UPDATE OPERATION STARTS --------------------------------
// ----------------------- UPDATE OPERATION STARTS --------------------------------

// UPDATE ADMIN PROFILE
server.post('/updateAdminProfile/:id', async (req, res) => {
    const adminId = req.params.id;
    const { firstname, username, email, password } = req.body;
    try {
        const result = await _conn.db(dbname).collection("admin").updateOne(
            { _id: new ObjectID(adminId) },
            { $set: { firstname: firstname, username: username, email: email}}
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send("admin not found");
        }
        res.redirect('/adminProfile')
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating admin");
    }
});

// UPDATE USER PROFILE
server.post('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, email, address } = req.body;
    // try {
        const result = await _conn.db(dbname).collection(tbname).updateOne(
            { _id: new ObjectID(userId) },
            { $set: { firstname: firstname, lastname: lastname, email: email, address: address}}
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send("User not found");
        } 
        res.redirect("/account")
         // Redirect back to the list of users
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send("Error updating user");
    // }
});

// UPDATE PRODUCT DETAILS
server.post('/updateProduct/:id', async (req, res) => {
    const productId = req.params.id;
    const { productName, brandName,  rating, delPrice, currentPrice, profileFile } = req.body;
    try {
        const result = await _conn.db(dbname).collection("products").updateOne(
            { _id: new ObjectID(productId) },
            { $set: {
                productName: productName,
                brandName: brandName,
                rating: rating,
                delPrice: delPrice,
                currentPrice: currentPrice,
                profileFile: profileFile
            }}
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send("product not found");
        }
        res.redirect('/productsDisplay'); // Redirect back to the list of users
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
    const result = await _conn.db(dbname).collection(tbname).deleteOne({ _id: new ObjectID(userId) });

    try {

        if (result.deletedCount === 0) {
            return res.status(404).send("Product not found");
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
    const result = await _conn.db(dbname).collection("products").deleteOne({ _id: new ObjectID(productId) });

    try {
        if (result.deletedCount === 0) {
            return res.status(404).send("Product not found");
        }
        res.redirect('/productsDisplay'); // Redirect back to the list of users
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
            // if (data.password !== check.password) { delete later
                return res.send("Incorrect Password");
            }

            const admin = await _conn.db(dbname).collection("admin").find().toArray();
            const users = await _conn.db(dbname).collection("users").find().toArray()
            jwt.sign(data, "regadmin", async function(err, token) {
                if (err) {
                    return res.send({ message: "unable to encrypt user data" });
                }
                res.cookie("reg_admin", check.password, { secure: true, httpOnly: true });
                res.render("dashboard", {feedback : users, admin: admin});
            });

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
                return res.send("Invalid Email");
            }

            const isPasswordMatch = await bcrypt.compare(data.password, check.password);
            if (!isPasswordMatch) {
                return res.send("Incorrect Password");
            }

            const products = await _conn.db(dbname).collection("products").find().toArray();
            jwt.sign(data, "reguser", async function(err, token) {
                if (err) {
                    return res.send({ message: "unable to encrypt user data" });
                }
                // You can specify an expiring date for the cookies 
                // To do this specify a method (Ex. expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds) in the third parameter 
                res.cookie("reg_user", check.password, { secure: true, httpOnly: true });
                res.render("index", { products: products });
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Internal Server Error");
        }
    } 
    else {
        res.send("All Fields are required");
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

// ----------------------- LOGIN / LOGOUT OPERATION ENDS --------------------------------
// ----------------------- LOGIN / LOGOUT OPERATION ENDS --------------------------------


const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

server.post("/checkout", async (req, res) => {
  const { cardNumber, expiryDate, cvv, amount, fullName, email, phoneNumber } = req.body;
    console.log(req.body)

  try {
    const response = await paystack.transaction.initialize({
        amount: parseInt(amount) * 100, // Paystack requires amount in kobo (1 NGN = 100 kobo)
        email: email,
      metadata: {
        fullName: fullName,
        phoneNumber: phoneNumber,
      }
    });

    // If payment was initialized successfully, return the authorization URL
    // res.json({ authorizationUrl: response.data.authorization_url });
    res.redirect(response.data.authorization_url)
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing payment");
  }
});



// LISTEN TO PORT
server.listen(process.env.PORT, function(error) {
    if(error) {
        console.log("unable to connect");
    } 
    else {
        console.log("server is listening on port 2000")
    }
})