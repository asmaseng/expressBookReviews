
const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: 'User already exists' });
    }

    users.push({ username, password });
    return res.status(200).json({ message: 'User successfully registered' });
});

public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
});

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
    );

    return res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
    );

    return res.status(200).json(result);
});


public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books' });
    }
});


public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`
        );
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || 'Error retrieving book'
        });
    }
});


public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`
        );
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books by author' });
    }
});

public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`
        );
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books by title' });
    }
});

public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
