import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Dummy from './Dummy';
import Login from './Login';
import NewUser from './NewUser';
import Dashboard from './Dashboard';
import NewListing from './NewListing';

import Listing from './Listing';

/**
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/listing'>
          <Listing/>
        </Route>
        <Route path='/newlisting'>
          <NewListing/>
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
        <Route path='/'>
          <Dashboard/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
