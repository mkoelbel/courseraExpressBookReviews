const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExists = (username) => {
    if (users.length > 0) {
        for (i in users) {
            if (users[i]["username"] === username) {
                return true; // found this username in users
            }
        }
        return false; // did not find this username in users
    }
    return false; // users is empty, so username def doesn't exist already
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // console.log(`type of reviews_to_update: ${typeof(books)}`);
    // console.log(`length of reviews: ${Object.keys(books).length}`);

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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const details = JSON.stringify(books[isbn]);
    res.send(`Book details for ISBN ${isbn}: ${details}`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    var details;
    for (i in books) {
        if (books[i].author === author) {
            details = JSON.stringify(books[i]);
            res.send(details);
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    var details;
    for (i in books) {
        if (books[i].title === title) {
            details = JSON.stringify(books[i]);
            res.send(details);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = JSON.stringify(books[isbn].reviews);
    res.send(`Book review for ISBN ${isbn}: ${review}`);
});

module.exports.general = public_users;