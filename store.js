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


// cloudinary for link of product
//pheonix
//materio

// CONFIGURATION SETTING
const server = express();
dotenv.config()

//CONNECT MONGODB
const _conn = new mongodb.MongoClient(process.env.DB_URL)

// USE SERVER
server.use(express.static(path.join(__dirname, "public")));
server.use(bodyParser.urlencoded({extended:false}));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser())

// SET ENGINE
server.set("view engine", "ejs")

// REASSIGN ENV DETAILS
const tbname = process.env.TABLE
const dbname = process.env.DB_NAME

//GET USER ROUTE
server.get("/", async (req, res) => {
    const products = await _conn.db(dbname).collection("products").find().toArray()
    if (products) {        
        res.render("index", {products: products})
    } else {
        res.status(401).send({
            message: "Products not found"
        })
    }
  })
  
server.get("/products", async (req, res) => {
const products = await _conn.db(dbname).collection("products").find().toArray()
if (products) {        
    res.render("products", {products: products})
} else {
    res.status(401).send({
        message: "Products not found"
    })
}
});


  server.get("/login", (req, res) => {
    res.render("login");
  });
  server.get("/signup", (req, res) => {
    res.render("signup");
  });
  server.get("/404", (req, res) => {
    res.render("404");
  });
  server.get("/about", (req, res) => {
    res.render("about");
  });
  server.get("/cart", (req, res) => {
    res.render("cart");
  });
  server.get("/checkout", (req, res) => {
    res.render("checkout");
  });
  server.get("/contact", (req, res) => {
    res.render("contact");
  });
  // Route for viewing product details
    server.get('/productDetails/:productId', async (req, res) => {
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
  server.get("/wishlist", (req, res) => {
    res.render("wishlist");
  });
  server.get("/account", (req, res) => {
    res.render("account");
  });

//GET ADMIN ROUTE
server.get("/adminLogin", (req, res) => {
    res.render("adminLogin")
})
server.get("/register", (req, res) => {
    res.render("form")
})





// ----------------------- CREATE OPERATION --------------------------------
// ----------------------- CREATE OPERATION --------------------------------


// server.get("/dashboard", (req, res) => {
//     res.render("dashboard")
// })
// server.get("/productsDisplay", (req, res) => {
//     res.render("productsDisplay")
// })
server.get("/addProduct", (req, res) => {
    res.render("addProduct")
})

// DISPLAY ALL REGISTERED USERS
server.get("/users", async (req, res) => {
    const feedback = await _conn.db(dbname).collection(tbname).find().toArray()
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    if (feedback) {
        res.render("dashboard", {feedback: feedback, admin: admin})
    } else {
        res.status(401).send({ message: "Users not found" })
    }
})
 
// EDIT USER PROFILE 
server.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await _conn.db(dbname).collection(tbname).findOne({ _id: new ObjectID(userId) });
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render('edit', { user: user, admin: admin });
});

// EDIT PRODUCT DETAILS
server.get('/editProduct/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await _conn.db(dbname).collection("products").findOne({ _id: new ObjectID(productId) });
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.render('editProduct', { product: product });
});

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
    const { firstname, username, email, password } = req.body;
    try {
        const result = await _conn.db(dbname).collection(tbname).updateOne(
            { _id: new ObjectID(userId) },
            { $set: { firstname: firstname, username: username, email: email, password: password}}
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.redirect('/users'); // Redirect back to the list of users
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user");
    }
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

// SEARCH USER
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

// ADMIN SEARCH PRODUCT
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

// USER SEARCH PRODUCT ON HOMEPAGE
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
// USER SEARCH PRODUCT ON PRODUCT PAGE
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

// REGISTER USER WRONG
server.post("/register", async function(req, res) {
    const firstname = req.body.firstname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const cPassword = req.body.cPassword;

    if(firstname.length>=0 || username.length>=0 ||  email.length>=0 ||  password.length>=0 || cPassword.length>=0) {
        if(password === cPassword) {
            const user_data = {
                firstname: firstname,
                username: username,
                email: email,
                // password: password,
                cPassword: cPassword
            }
            //header, payload, signature
            jwt.sign(user_data, "reguser", async function(err, token) {
                if(err) {
                    res.send({
                        mesage: "unable to encrypt user data"
                    })
                } else {
                    const hashKey = await bcrypt.hash(password, 10);
                    res.cookie("reg_user", hashKey, {secure: true, httpOnly:true})
                    const feedback = await _conn.db(dbname).collection(tbname).insertOne(user_data)
                    if (feedback) {
                        // res.status(200).send({
                        //     message: "user registered successfully"
                        // }) 
                        res.render("adminLogin")
                    } else {
                        res.status(401).send({
                            message: "unable to register"
                        })
                    }

                    // const ismatch =  await bcrypt.compare(password, hashKey)
                    // console.log(ismatch)
                    // res.send({
                    //     message: "password hash successfully",
                    //     hashKey : hashKey  
                    // })
                }
            })
            
        } else {
            res.send({
                message: "Password mismatched"
            })
        }
    }
})

// REGISTER USER
server.post("/signup", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  
    const data = {
        firstname: req.body.firstname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    };
  
    const existingEmail = await _conn.db(dbname).collection(tbname).findOne({email: data.email});
    if (existingEmail) {
      res.send("Email already exists. Please choose a different email");
    } else {
      try {
         //header, payload, signature
         jwt.sign(user_data, "reguser", async function(err, token) {
            if(err) {
                res.send({
                    mesage: "unable to encrypt user data"
                })
            } else {
                const hashKey = await bcrypt.hash(password, 10);
                res.cookie("reg_user", hashKey, {secure: true, httpOnly:true})
                const userdata = await _conn.db(dbname).collection(tbname).insertOne(data);
                if (feedback) {
                    // res.status(200).send({
                    //     message: "user registered successfully"
                    // }) 
                    res.redirect("/login")
                } else {
                    res.status(401).send({
                        message: "unable to register"
                    })
                }
                // const ismatch =  await bcrypt.compare(password, hashKey)
                // console.log(ismatch)
                // res.send({
                //     message: "password hash successfully",
                //     hashKey : hashKey  
                // })
            }
        })
      } catch {
        res.redirect("/signup")
      }
    }
  });

// GET ADMIN PROFILE
server.get("/adminProfile", async (req, res) => {
    const admin = await _conn.db(dbname).collection("admin").find().toArray()
    res.render("adminProfile", {admin : admin})
})

// LOGIN ADMIN
server.post("/adminLogin", async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    if(email.length>=0 || password.length>=0) {
        const usercred = req.cookies.reg_user
        const ismatch = await bcrypt.compare(password, usercred)
        // res.send(usercred)
        const admin = await _conn.db(dbname).collection("admin").find().toArray()
        if(ismatch) {
            if (admin) {
                const users = await _conn.db(dbname).collection("users").find().toArray()
                res.render("dashboard", {users : users, admin: admin});
                // ("adminProfile", {feedback : feedback});
                // console.log(feedback)
            } else {
                res.status(401).send({
                    message: "Users not found"
                })
            }
        } else {
            res.status(401).send ({
                message: "invalid password"
            })
        }
    } else {
        res.send({
            message: "fill the required field"
        })
    }
})

// LOGIN USER
server.post("/login", async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    if(email.length>=0 || password.length>=0) {
        const usercred = req.cookies.reg_user
        const ismatch = await bcrypt.compare(password, usercred)
        // res.send(usercred)
        const feedback = await _conn.db(dbname).collection(tbname).find().toArray()
        const products = await _conn.db(dbname).collection("products").find().toArray()
        if(ismatch) {
            if (feedback) {
                res.render("index", {products: products});
                // console.log(feedback)
            } else {
                res.status(401).send({
                    message: "User not found"
                })
                res.redirect("/login")
            }
        } else {
            res.status(401).send ({
                message: "Invalid Email or password"
            })
            res.redirect("/login")
        }
    } else {
        res.send({
            message: "fill the required field"
        })
    }
})

// server.post("/login", async (req, res) => {
//     try {
//           const check = await collection.findOne({email: req.body.email});
//           const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//           if(!check) {
//             res.send("Invalid Email");
//           }
//           else if(isPasswordMatch) {
//             res.render("index");
//             server.get("/account", (req, res) => {
//               res.render("account", {name: check.name, email: check.email}); 
//             });
//           } else {
//             res.send("Wrong password");
//           }
//       } catch {
//             res.redirect("/login")
//         }
//   })

// LOGOUT ADMIN
server.get("/admin/logout", function(req, res) {
    console.log(req.cookies);
    res.clearCookie("reg_user")
    res.send({
        message: "this is the logout session"
    })
})





// upload image middleware
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
var uploads = multer({storage:storage})

// READ AND DISPLAY PRODUCT FROM THE DATABASE
server.get("/productsDisplay", async (req, res) => {
    const products = await _conn.db(dbname).collection("products").find().toArray()
    
    if (products) {
        res.render("productsDisplay", {products: products})
        {"index", {products: products}}
        {"products", {products: products}}
    } else {
        res.status(401).send({
            message: "Product not found"
        })
    }
})

// create/add a product to database
server.post("/productsDisplay", /**uploads.single("profileFile"),**/ async function (req, res, next)  {
    // console.log(req.file.filename);
    const products = await _conn.db(dbname).collection("products").find().toArray()
    const { productName, brandName, rating, delPrice, currentPrice, profileFile } = req.body;
    const product_data = {
        productName: productName,
        brandName: brandName,
        rating: rating,
        delPrice: delPrice,
        currentPrice: currentPrice,
        profileFile: profileFile
    }

    const feedback = await _conn.db(dbname).collection("products").insertOne(product_data);
    if (feedback) {
        res.redirect("productsDisplay")
    } else {
        res.status(401).send({
            message: "unable to add product"
        })
    }
}) 




// Jquery teaching route
server.get("/jq/teachings", function(req, res) {
    res.render("jqdemo")
})


// LISTEN TO PORT
server.listen(process.env.PORT, function(error) {
    if(error) {
        console.log("unable to connect");
    } 
    else {
        console.log("server is listening on port 2000")
    }
})