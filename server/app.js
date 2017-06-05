const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const low = require('lowdb');
const bodyParser = require('body-parser');

const db = low('db.json');
const app = express();

db.defaults({books: []}).write();

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get('/v1/books', (req, res) => {
  const books = db.get('books');
  res.json(books);
});

app.post('/v1/books', (req, res) => {
  const {book, rating} = req.body;

  db.get('books').remove({id: book.id}).write();

  db.get('books').push({
    id: book.id,
    book: book,
    rating: rating,
  }).write();

  res.json(db.get('books'));
});

app.delete('/v1/books/:id', (req, res) => {
  db.get('books').remove({id: req.params.id}).write();
  res.send('');
});

app.get('/v1/search', (req, res) => {

});

module.exports = app;
