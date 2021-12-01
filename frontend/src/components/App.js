import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Dummy from './Dummy';
import Login from './Login';
import NewUser from './NewUser';
import Dashboard from './Dashboard';

/**
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/'>
          <Dashboard/>
        </Route>
        <Route path='/login'>
          <Login/>
        </Route>
        <Route path='/newuser'>
          <NewUser/>
        </Route>
        <Route path='/dummy'>
          <Dummy/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
