import React, {Component} from 'react';
import ReactStars from 'react-stars';
import {chunk, truncate, orderBy} from 'lodash';

import api from '../../lib/api';

import './style.css';

class Label extends Component {
  hash() {
    const {value} = this.props;

    let hash = 0, i, chr;

    if (value.length === 0) {
      return hash;
    }

    for (i = 0; i < value.length; i++) {
      chr   = value.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }

    return Math.abs(hash);
  }

  render() {
    const {value} = this.props;

    const types = [
      'default',
      'primary',
      'success',
      'info',
      'warning',
      'danger',
    ];

    const type = this.hash() % types.length;

    return (
      <span className={`label label-${types[type]}`}>
        {value}
      </span>
    )
  }
}

class Book extends Component {
  constructor(props) {
    super(props);

    this.state = {
      truncated: true,
    };

    this.handleRate = this.handleRate.bind(this);
    this.handleReadMore = this.handleReadMore.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRate(rating) {
    api.save(this.props.book, rating);
  }

  handleReadMore(e) {
    e.preventDefault();
    this.setState({truncated: !this.state.truncated});
  }

  handleRemove(e) {
    e.preventDefault();
    api.delete(this.props.book.id).then(() => {
      this.props.onDelete();
    });
  }

  render() {
    const {book, rating} = this.props;
    const {title, authors, imageLinks, description, categories} = book.volumeInfo;

    return (
      <div className="col-sm-2">
        <div className="thumbnail">
          {imageLinks && <img alt={title} src={imageLinks.smallThumbnail} />}
          <div className="caption">
            <h3>{title}</h3>

            {authors && <strong><em>{authors.join(', ')}</em></strong>}

            {categories &&
              <p>
                {categories.map((category, index) => {
                  return <Label key={index} value={category} />;
                })}
              </p>
            }

            <p>
              {this.state.truncated ? truncate(description, {length: 100}) : description}

              &nbsp;<a href="/" onClick={this.handleReadMore}>
                {this.state.truncated ? 'read more' : 'read less'}
              </a>
            </p>

            <ReactStars
              value={rating}
              count={5}
              size={24}
              color2={'#ffd700'}
              onChange={this.handleRate}
            />

            <p>
              <a href="/" className="btn btn-primary" onClick={this.handleRemove}>
                Remove
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default class Browse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      books: [],
      error: null,
      filter: '',
      sort: [['book.volumeInfo.title'], ['asc']],
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    this.loadBooks();
  }

  loadBooks() {
    this.setState({loading: true});

    api.list().then((books) => {
      this.setState({books, loading: false});
    }).catch((error) => {
      this.setState({error, loading: false});
    });
  }

  progress() {
    const total = this.state.books.length;
    const read = this.state.books.filter((book) => book.rating > 0).length;

    return (100 / total) * read;
  }

  filteredBooks() {
    const {books, filter, sort} = this.state;

    const filtered = books.filter((book) => {
      const {title, authors} = book.book.volumeInfo;

      if (title.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
        return true;
      }

      return (authors || []).some((author) => {
        return author.toLowerCase().indexOf(filter.toLowerCase()) > -1;
      });
    });

    return orderBy(filtered, ...sort);
  }

  handleDelete() {
    this.loadBooks();
  }

  handleSort(sort) {
    this.setState({sort});
  }

  render() {
    const progress = this.progress();
    const books = this.filteredBooks();
    const rows = chunk(books, 6);

    return (
      <div className="Browse">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <h1>Browse</h1>
              </div>
            </div>
          </div>

          <div className="row Browse-controls">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Filter..."
                type="text"
                onChange={(e) => this.setState({filter: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <div className="btn-toolbar">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => this.handleSort([['book.volumeInfo.title'], ['asc']])}
                  >
                    <span className="glyphicon glyphicon-sort-by-alphabet"></span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => this.handleSort([['rating'], ['desc']])}
                  >
                    <span className="glyphicon glyphicon-sort-by-attributes-alt"></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="progress">
                <div className="progress-bar progress-bar-success" style={{width: `${progress}%`}}>
                  {Math.round(progress)}% read
                </div>
              </div>
            </div>
            <div className="col-md-1">
              <small>
                <em className="pull-right">
                  {books.length} books
                </em>
              </small>
            </div>
          </div>

          {rows.map((row, index) => {
            return (
              <div key={index} className="row">
                {row.map((book) => {
                  return (
                    <Book
                      key={book.id}
                      onDelete={this.handleDelete}
                      {...book}
                    />
                  )
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
