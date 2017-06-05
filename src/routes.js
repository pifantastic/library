// src/routes.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import App from './components/App';
import NotFound from './components/NotFound';

const Routes = () => (
  <Router>
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
