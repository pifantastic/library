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
  res.json(db.get('books'));
});

app.post('/v1/books', (req, res) => {
  const {book, rating} = req.body;
  const now = Date.now();
  const existingBook = db.get('books').find({id: book.id}).value();

  if (existingBook) {
    db.get('books')
      .find({id: book.id})
      .assign({
        rating: rating,
        updated: now,
      })
      .write()
  } else {
    db.get('books')
      .push({
        id: book.id,
        book: book,
        rating: rating,
        updated: now,
        added: now,
      })
      .write();
  }

  res.json(db.get('books'));
});

app.delete('/v1/books/:id', (req, res) => {
  db.get('books').remove({id: req.params.id}).write();
  res.send('');
});

module.exports = app;
