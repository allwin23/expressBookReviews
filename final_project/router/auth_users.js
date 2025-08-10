const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (unique)
const isValid = (username) => {
    return !users.some(user => user.username === username);
};

// Authenticate username/password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    let accesstoken = jwt.sign({ username }, "access", { expiresIn: '1h' });

    // Store access token in session
    req.session.authenticated = { accesstoken, username };

    return res.status(200).json({
        message: "Login successful",
        token: accesstoken
    });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const accessToken = req.session?.authenticated?.accesstoken;

    if (!accessToken) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    jwt.verify(accessToken, "access", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const username = decoded.username;
        const isbn = req.params.isbn;
        const review = req.body.review;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!review) {
            return res.status(400).json({ message: "Review text is required" });
        }

        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: books[isbn].reviews
        });
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const accessToken = req.session?.authenticated?.accesstoken;

    if (!accessToken) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    jwt.verify(accessToken, "access", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const username = decoded.username;
        const isbn = req.params.isbn;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
        } else {
            return res.status(404).json({ message: "Review not found for this user" });
        }

        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
