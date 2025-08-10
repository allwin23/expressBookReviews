const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
      if(!username&!password){
        res.status(403).json({message:"the password and username is not provided"})
      }
      const usernameexists = users.find(user=>user.username==username);
      if(usernameexists){
        res.status(403).json({message:"username already exist"})
    }
    users.push({username,password});
    return res.status(200).json({ message: "User registered successfully" });
      }
    )

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

  public_users.get('/promise-isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5001/isbn/${isbn}`)
        .then(response => res.send(response.data))
        .catch(err => res.status(500).json({ message: "Error fetching book by ISBN", error: err.message }));
});

// 📖 Task 11: Get book details by ISBN using async-await
public_users.get('/async-isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
    }
}); });
 public_users.get('/promise-books', function (req, res) {
    axios.get('http://localhost:5001/')
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            res.status(500).json({ message: "Error fetching books", error: err.message });
        });
});

// 3️⃣ Async-await version
public_users.get('/async-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/');
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books", error: err.message });
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
    let title = req.params.title;
    let result1 = Object.values(books).filter(book=> book.title==title);
    if(result1.length > 0){
      res.send(result1);
    }else{
      res.status(403).json({message:"the book is not found"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    res.send(book.reviews);
  }else{
    res.status(402).json({message:"the book is not found"})
  }
});
public_users.get('/promise-author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`http://localhost:5001/author/${author}`)
        .then(response => res.send(response.data))
        .catch(err => res.status(500).json({ message: "Error fetching books by author", error: err.message }));
});

public_users.get('/async-author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5001/author/${author}`);
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by author", error: err.message });
    }
});

/* ---------------- TASK 13 (Title) ---------------- */
public_users.get('/promise-title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5001/title/${title}`)
        .then(response => res.send(response.data))
        .catch(err => res.status(500).json({ message: "Error fetching books by title", error: err.message }));
});

public_users.get('/async-title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5001/title/${title}`);
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by title", error: err.message });
    }
});

module.exports.general = public_users;
