import React, {Component} from 'react';
import Search from '../Search';
import Add from '../Add';

import './style.css';

export default class Curate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: null,
    };

    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(book) {
    this.setState({adding: book});
  }

  render() {
    return (
      <div className="Home">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <h1>Curate</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Search onAdd={this.handleAdd} />
            </div>

            <div className="col-md-8">
              <Add book={this.state.adding} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
