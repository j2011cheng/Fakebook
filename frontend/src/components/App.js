import React, {useState, createContext} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Dummy from './Dummy';
import Login from './Login';
import NewUser from './NewUser';
import Dashboard from './Dashboard';

export const GlobalContext = createContext({
  pageView: '',
  setPageView: {},
});

/**
 * @return {object} JSX
 */
function App() {
  const [pageView, setPageView] = useState('Sign-Up');

  return (
    <GlobalContext.Provider value={[pageView, setPageView]}>
      {
        {
          'Dashboard': <Dashboard/>,
          'Sign-In': <Login/>,
          'Sign-Up': <NewUser/>,
        }[pageView]
      }
      <BrowserRouter>
        <Switch>
          <Route path='/' exact>
            <Dummy/>
          </Route>
          <Route path='/dummy'>
            <Dummy/>
          </Route>
          <Route path='/login'>
            <Login/>
          </Route>
          <Route path='/newuser'>
            <NewUser/>
          </Route>
        </Switch>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
}

export default App;
