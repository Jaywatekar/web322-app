const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        const itemsPath = path.join(__dirname, 'data', 'items.json');
        const categoriesPath = path.join(__dirname, 'data', 'categories.json');

        // Check if items.json exists
        if (!fs.existsSync(itemsPath)) {
            reject("Error: items.json file does not exist in the data folder.");
            return;
        }

        // Read items.json
        fs.readFile(itemsPath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading items.json:", err.message);
                reject("Unable to read items.json");
                return;
            }

            try {
                items = JSON.parse(data); // Parse the JSON into the items array
                console.log("items.json loaded successfully.");
            } catch (parseErr) {
                console.error("Error parsing items.json:", parseErr.message);
                reject("Error parsing items.json");
                return;
            }

            // Check if categories.json exists
            if (!fs.existsSync(categoriesPath)) {
                reject("Error: categories.json file does not exist in the data folder.");
                return;
            }

            // Read categories.json
            fs.readFile(categoriesPath, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading categories.json:", err.message);
                    reject("Unable to read categories.json");
                    return;
                }

                try {
                    categories = JSON.parse(data); // Parse the JSON into the categories array
                    console.log("categories.json loaded successfully.");
                } catch (parseErr) {
                    console.error("Error parsing categories.json:", parseErr.message);
                    reject("Error parsing categories.json");
                    return;
                }

                // Both files are read and parsed successfully
                resolve("Data successfully initialized");
            });
        });
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length > 0) {
            resolve(items);
        } else {
            reject("No items found");
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}

module.exports = {
    initialize,
    getAllItems,
    getCategories
};
