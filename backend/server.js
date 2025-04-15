const express = require('express');
const cors = require('cors');
const app = express();
const db  = require('./dbConnection'); 

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});

app.get('/api/login', (req, res) => {
    res.send('Login Page');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});