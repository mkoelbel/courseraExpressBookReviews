const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
};

const authenticatedUser = (username,password) => { //returns boolean
    for (i in users) {
        if (users[i].username === username && users[i].password === password) {
            return true;
        }
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        // missing username and/or password
        res.status(404).json({message: "Username and/or password was not provided."});
    } else if (users.length === 0) {
        // we don't have any registered users (so shouldn'e even be using this endpoint)
        return res.status(208).json({message: "No registered users."});
    } else if (!authenticatedUser(username, password)) {
        // couldn't find this username & password combo in our registered users list
        return res.status(208).json({message: "Invalid username or password."});
    } else {
        // correct username and password!
        let accessToken = jwt.sign(
            { data: password }, 
            'access', 
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = { accessToken, username }
        return res.status(200).send("User successfully logged in!");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const submitted_review = req.params.review;
    const reviews_to_update = books[isbn]["reviews"];
    const user = req.session.authorization["username"];

    // const review_to_add = {
    //     "username": user,
    //     "review": submitted_review
    // };

    // for (i in reviews_to_update) {
    //     if (i["username"] === user) {
    //         i["review"] = submitted_review;
    //         res.send(`Updated your review for ISBN ${isbn}`)
    //         return;
    //     }
    // }
    // reviews_to_update = [...reviews_to_update, review_to_add];
    res.send(`Added a review for ISBN ${isbn}`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
