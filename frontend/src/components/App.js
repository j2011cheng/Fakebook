import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dummy from './Dummy';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Dummy/>
        </Route>
        <Route path='/dummy' exact>
          <Dummy/>
        </Route>
        <Route path='/login'>
          <Login/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
