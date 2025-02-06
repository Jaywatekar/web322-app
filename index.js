// Import the express module to create the server
const express = require('express');

// Import the path module to handle file paths easily
const path = require('path');

// Initialize the express application
const app = express();

// Choose a unique port number (not 3000 or 8080) for the server
const port = 3243;

// Middleware function to serve static files like CSS, images, etc., from the "public" directory
app.use(express.static('public'));

// Define a route for the homepage ("/")
// Instead of showing content here, it redirects the user to the "/about" page
app.get('/', (req, res) => {
    res.redirect('/about'); // Redirects the user to the About page
});


// Define a route for "/about"
// When the user visits "/about", the server sends the "about.html" file as a response
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html')); // Sends the "about.html" file located in the "views" folder
});

// Start the server and make it listen on the selected port
app.listen(port, () => {
    console.log(`Express HTTP server is running and listening on port ${port}`);
});
