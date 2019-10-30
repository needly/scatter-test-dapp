import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import scatterTest from './scatterTest/scatterTest';

import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" component={scatterTest} />
      <Redirect from="/*" to="/eos" />
    </Switch>
  );
}

export default App;
