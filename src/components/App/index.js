import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  NavLink,
} from 'react-router-dom';
import NotFound from '../NotFound';
import Curate from '../Curate';
import Browse from '../Browse';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">Aaron's Library</Link>
              </div>
              <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li><NavLink activeClassName="active" to="/">Browse</NavLink></li>
                  <li><NavLink activeClassName="active" to="/curate">Curate</NavLink></li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container-fluid">
            <Switch>
              <Route exact path="/curate" component={Curate} />
              <Route exact path="/" component={Browse} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
