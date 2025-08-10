const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,10));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    res.send(JSON.stringify(book,book,1));
  }else{
    res.status(402).json({message:"the book is not found"})
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let result = Object.values(books).filter(book=> book.author==author);
  if(result.length > 0){
    res.send(result);
  }else{
    res.status(403).json({message:"the book is not found"})
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
