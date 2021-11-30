import React, {useState, createContext} from 'react';

import Login from './Login';
import NewUser from './NewUser';
import Dashboard from './Dashboard';

export const GlobalContext = createContext({
  pageView: '',
  setPageView: {},
  categorySelected: '',
  setCategorySelected: {},
});

/**
 * @return {object} JSX
 */
function App() {
  const [pageView, setPageView] = useState('Dashboard');
  const [categorySelected, setCategorySelected] = useState('Vehicles');

  return (
    <GlobalContext.Provider value={{page: [pageView, setPageView],
      category: [categorySelected, setCategorySelected]}}>
      {
        {
          'Dashboard': <Dashboard/>,
          'Sign-In': <Login/>,
          'Sign-Up': <NewUser/>,
        }[pageView]
      }
    </GlobalContext.Provider>
  );
}

export default App;
