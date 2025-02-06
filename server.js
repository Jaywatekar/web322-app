/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Jay Sanjay Watekar 
Student ID: 167268226 
Date: 02/06/2025
Vercel Web App URL: _______________________________________________________
GitHub Repository URL: ______________________________________________________

********************************************************************************/ 


const contentService = require('./content-service');
const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.static('public'));

app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then((data) => res.json(data))
        .catch((err) => res.status(404).json({ message: "No categories found", error: err }));
});

// Initialize content service before setting up routes
contentService.initialize()
    .then(() => {
        console.log("Content service initialized");

        // Route for Home ('/')
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        // Route for About ('/about')
        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        // Route for fetching shop ('/shop')
        app.get('/shop', (req, res) => {
            contentService.getAllItems()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json({ message: err });
                });
        });

        // Route for fetching all items ('/items')
        app.get('/items', (req, res) => {
            contentService.getAllItems()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json({ message: err });
                });
        });

        // Route for fetching all categories ('/categories')
        app.get('/data/categories', (req, res) => {
            contentService.getCategories()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json({ message: err });
                });
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    })
    .catch((err) => {
        console.error(`Failed to initialize content service: ${err}`);
    });
