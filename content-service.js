const fs = require('fs');
const path = require('path');

let items = []; // Array to store all items
let categories = []; // Array to store all categories

// Function to initialize the service
function initialize() {
    return new Promise((resolve, reject) => {
        // Read the items.json file
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read items.json"); // Reject promise if file cannot be read
                return;
            }

            try {
                items = JSON.parse(data); // Parse items.json content into the items array
            } catch (parseErr) {
                reject("Error parsing items.json"); // Reject promise if JSON is invalid
                return;
            }

            // Read the categories.json file
            fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories.json"); // Reject promise if file cannot be read
                    return;
                }

                try {
                    categories = JSON.parse(data); // Parse categories.json content into the categories array
                } catch (parseErr) {
                    reject("Error parsing categories.json"); // Reject promise if JSON is invalid
                    return;
                }

                resolve("Data successfully initialized"); // Resolve the promise once both files are read successfully
            });
        });
    });
}

// Function to add a new item
module.exports.addItem = (itemData) => {
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published ? true : false; // Set the 'published' flag based on the input data
        itemData.id = items.length + 1; // Assign a new unique ID to the item
        items.push(itemData); // Add the new item to the items array
        resolve(itemData); // Resolve promise with the added item data
    });
};

// Function to get all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length > 0) {
            resolve(items); // Resolve promise with all items if the array is not empty
        } else {
            reject("No items found"); // Reject promise if no items exist
        }
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories); // Resolve promise with all categories if the array is not empty
        } else {
            reject("No categories found"); // Reject promise if no categories exist
        }
    });
}

// Function to get items by category
function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        ); // Filter items by category
        if (filteredItems.length > 0) {
            resolve(filteredItems); // Resolve promise with filtered items
        } else {
            reject(`No items found for category: ${category}`); // Reject promise if no items match
        }
    });
}


// Function to get items by minimum date
module.exports.getItemsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr); // Convert input date string to a Date object
        if (isNaN(minDate)) {
            return reject("Invalid date format"); // Reject promise if the date is invalid
        }

        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate); // Filter articles by date
        if (filteredItems.length > 0) {
            resolve(filteredItems); // Resolve promise with filtered items if any are found
        } else {
            reject("No results returned"); // Reject promise if no items match the date criteria
        }
    });
};

// Function to get an item by ID
module.exports.getItemById = (id) => {
    return new Promise((resolve, reject) => {
        const foundItem = items.find(item => item.id == id); // Find the item with the given ID
        if (foundItem) {
            resolve(foundItem); // Resolve promise with the found items
        } else {
            reject("No result returned"); // Reject promise if no item matches the ID
        }
    });
};

// Module exports
module.exports = {
    initialize: initialize, // Export the initialize function
    getAllItems: getAllItems, // Export the getAllItems function
    getCategories: getCategories, // Export the getCategories function
    addItem: module.exports.addItem, // Export the addItem function
    getItemsByCategory: getItemsByCategory, // Correctly export getItemsByCategory
    getItemsByMinDate: module.exports.getItemsByMinDate, // Export the getItemsByMinDate function
    getItemById: module.exports.getItemById // Export the getItemById function
};