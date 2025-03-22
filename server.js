/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Jay Watekar
Student ID: 167268226
Date: 03/20/2024
vercel Web App URL: web322-app-ebon-nine.vercel.app 
GitHub Repository URL: https://github.com/Jaywatekar/web322-app.git

********************************************************************************/
const contentService = require('./content-service');
const express = require('express');
const path = require('path');
const app = express();
const port = 3243;
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Set up EJS as the templating engine for rendering views
app.set('view engine', 'ejs');

// Specify where the view templates are located
app.set('views', path.join(__dirname, 'views'));

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'drjtwtf20',
    api_key: '515913738451826',
    api_secret: '6k5qtHlGQRNg9V4AZ2kgEgg_9i4', // Replace this with your actual API Secret
    secure: true,
});

// Multer configuration to handle file uploads in memory
const upload = multer();

// Serve static files from the "public" folder for assets like CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the content service and set up routes
contentService.initialize()
    .then(() => {
        console.log("Content service initialized");

        // Home Route: Displays the "About Me" page
        app.get('/', (req, res) => {
            res.render('about', { title: "About Me" });
        });

        // About Route: Redirects to the same "About Me" page
        app.get('/about', (req, res) => {
            res.render('about', { title: "About Me" });
        });

        // Categories Route: Lists all available categories
        app.get('/categories', (req, res) => {
            contentService.getCategories()
                .then((data) => res.render('categories', { categories: data, error: null }))
                .catch((err) => res.render('categories', { categories: [], error: err }));
        });

        // items Route: Fetches items based on filters or displays all
        app.get('/items', (req, res) => {
            if (req.query.category) {
                contentService.getItemsByCategory(req.query.category)
                    .then((data) => res.render('items', { items: data, error: null }))
                    .catch((err) => res.render('items', { items: [], error: err }));
            } else if (req.query.minDate) {
                contentService.getItemsByMinDate(req.query.minDate)
                    .then((data) => res.render('items', { items: data, error: null }))
                    .catch((err) => res.render('items', { items: [], error: err }));
            } else {
                contentService.getAllItems()
                    .then((data) => res.render('items', { items: data, error: null }))
                    .catch((err) => res.render('items', { items: [], error: err }));
            }
        });

        // Add Item Route (GET): Displays the "Add New Item" form
        app.get('/items/add', (req, res) => {
            res.render('addItem', { title: "Add a New Item" });
        });

        // Add Item Route (POST): Handles form submissions for new items
        app.post('/items/add', upload.single("featureImage"), (req, res) => {
            if (req.file) {
                const streamUpload = (req) => {
                    return new Promise((resolve, reject) => {
                        let stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        });
                        streamifier.createReadStream(req.file.buffer).pipe(stream);
                    });
                };

                async function upload(req) {
                    let result = await streamUpload(req);
                    return result;
                }

                upload(req)
                    .then((uploaded) => processItem(uploaded.url))
                    .catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
            } else {
                processItem("");
            }

            function processItem(imageUrl) {
                req.body.featureImage = imageUrl;

                contentService.addItem(req.body)
                    .then(() => res.redirect('/items'))
                    .catch(err => res.status(500).json({ message: "Item creation failed", error: err }));
            }
        });

        // Fetch a Single Item by ID (Query Param)
        app.get('/item', (req, res) => {
            const itemId = req.query.id;

            contentService.getItemById(itemId)
                .then((item) => res.render('items', { items: [item], error: null }))
                .catch((err) => res.render('items', { items: [], error: "Item not found!" }));
        });

        // Display a Single Item by ID (Route Param)
        app.get('/item/:id', (req, res) => {
            const itemId = req.params.id;

            console.log("Item ID Requested: ", itemId); // Log the requested ID

            contentService.getItemById(itemId)
                .then((item) => {
                    if (!item.published) {
                        console.log("Item is not published."); // Debugging info
                        return res.status(404).render('404', { message: "Item not found or not published." });
                    }
                    console.log("Item Found: ", item); // Log the found item
                    res.render('item', { item });
                })
                .catch((err) => {
                    console.log("Error: ", err); // Log any errors
                    res.status(404).render('404', { message: "Item not found." });
                });
        });

        // Start the server and listen on the specified port
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

    })
    .catch((err) => {
        console.error(`Failed to initialize content service: ${err}`);
    });