import React, {Component} from 'react';
import ReactStars from 'react-stars';

import api from '../../lib/api';

import './style.css';

export default class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: null,
      saving: false,
      added: false,
      error: null,
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleRate = this.handleRate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.book && this.props.book && nextProps.book.id !== this.props.book.id) {
      this.setState({
        rating: null,
        saving: false,
        added: false,
        error: null,
      });
    }
  }

  handleRate(rating) {
    this.setState({rating});
  }

  handleSave() {
    const {book} = this.props;
    const {rating} = this.state;

    this.setState({saving: true});

    api.save(book, rating || 0).then(() => {
      this.setState({saving: false, added: true});
    }).catch((error) => {
      this.setState({saving: false, added: false, error});
    });
  }

  renderEmpty() {
    const {book} = this.props;

    if (book !== null) {
      return null;
    }

    return (
      <p>
        Search for a book to add it to your library.
      </p>
    )
  }

  renderBook() {
    const {book} = this.props;
    const {added, saving} = this.state;

    if (book === null) {
      return null;
    }

    const {title, imageLinks, description} = book.volumeInfo;

    return (
      <div className="Add-book">
        <h2>{title}</h2>
        {imageLinks && <img alt={title} src={imageLinks.smallThumbnail} />}
        <p>{description}</p>
        {!added && <ReactStars
          value={this.state.rating}
          count={5}
          onChange={this.handleRate}
          size={24}
          color2={'#ffd700'}
        />}
        {!added &&
          <button onClick={this.handleSave} disabled={saving}>
            Save to your library
          </button>
        }
        {added && <div>Boom! Added to your library.</div>}
      </div>
    )
  }

  render() {
    return (
      <div className="Add">
        <h2>Add</h2>

        <hr />

        {this.renderEmpty()}
        {this.renderBook()}
      </div>
    );
  }
}
