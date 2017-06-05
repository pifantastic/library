import React, {Component} from 'react';
import {debounce} from 'lodash';

import googleBooks from '../../lib/google-books';

import './style.css';

const SearchResult = (props) => {
  const {title, authors, publishedDate, imageLinks} = props.result.volumeInfo;

  return (
    <div className="media">
      <div className="media-left">
        {imageLinks && <img className="media-object" alt={title} src={imageLinks.smallThumbnail} />}
      </div>
      <div className="media-body">
        <h4 className="media-heading">{title}</h4>
        <em>{authors && authors.join(', ')}</em>
        <dl>
          <dt>Published</dt>
          <dd>{publishedDate}</dd>
        </dl>
        <button onClick={() => props.onAdd(props.result)}>
          Add to library
        </button>
      </div>
    </div>
  );
}

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      error: null,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.debouncedChange = debounce(this.debouncedChange.bind(this), 500);
  }

  debouncedChange(e) {
    this.setState({loading: true});

    googleBooks.search(e.target.value).then((response) => {
      this.setState({loading: false, results: response.items.slice(0, 10)});
    }).catch((error) => {
      this.setState({loading: false, error});
    });
  }

  handleChange(e) {
    e.persist();
    this.debouncedChange(e);
  }

  renderLoading() {
    const {loading} = this.state;

    if (!loading) {
      return null;
    }

    return <span>Loading...</span>;
  }

  renderResults() {
    const {onAdd} = this.props;
    const {results} = this.state;

    if (!results.length) {
      return null;
    }

    return (
      <div className="Search-results">
        {results.map((result) => {
          return (
            <SearchResult
              result={result}
              key={result.id}
              onAdd={onAdd}
            />
          );
        })}
      </div>
    )
  }

  render() {
    return (
      <div className="Search">
        <h2>Search</h2>

        <hr />

        <div>
          <input type="text" className="form-control" placeholder="Search for..." onChange={this.handleChange} />
        </div>

        {this.renderLoading()}
        {this.renderResults()}
      </div>
    );
  }
}
