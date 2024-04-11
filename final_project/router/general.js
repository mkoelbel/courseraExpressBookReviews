const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Does username exist in our records? (Has a user registered with this username?)
// Returns boolean
const userExists = (username) => {
    for (i in users) {
        if (users[i]["username"] === username) {
            return true; // found this username in users list
        }
    }
    return false; // did NOT find this username in users list
};

// Task 6.
// Register a user (store username and password)
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!userExists(username)) {
        users.push({ username: username, password: password });
        res.status(200).json({message: "User successfully registered. You can now login."});
      } else {
        res.status(404).json({message: "Username already exists."});
      }
    } else {
        res.status(404).json({message: "Username and/or password was not provided."});
    }
});

// Task 1., 10.
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books)));
    });
    getBooks.then(() => console.log(`Resolved promise for getting books (Task 10.)`));
});

// Task 2., 11.
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let getBookDetails = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const details = JSON.stringify(books[isbn]);
        resolve(res.send(`Book details for ISBN ${isbn}: ${details}`));
    });
    getBookDetails.then(() => console.log(`Resolved promise for getting book details (Task 11.)`));
 });

// Task 3., 12.
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let getBookDetails = new Promise((resolve, reject) => {
        const author = req.params.author;
        var details;
        for (i in books) {
            if (books[i].author === author) {
                details = JSON.stringify(books[i]);
                resolve(res.send(details));
            }
        }
    });
    getBookDetails.then(() => console.log(`Resolved promise for getting book details (Task 12.)`));
});

// Task 4., 13.
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let getBookDetails = new Promise((resolve, reject) => {
        const title = req.params.title;
        var details;
        for (i in books) {
            if (books[i].title === title) {
                details = JSON.stringify(books[i]);
                resolve(res.send(details));
            }
        }
    });
    getBookDetails.then(() => console.log(`Resolved promise for getting book details (Task 13.)`));
});

// Task 5.
//  Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = JSON.stringify(books[isbn].reviews);
    res.send(`Book review for ISBN ${isbn}: ${review}`);
});

module.exports.general = public_users;
