import React from 'react';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';

import Search from './Search';


/**
 *
 * @return {object} JSX
 */
function SideBarTopContent() {
  const history = useHistory();

  const user = React.useCallback(() => {
    return localStorage.getItem('user');
  }, []);

  return (
    <div>
      <Search/>
      {user() ? (
        <Button
          variant='contained'
          name='new listing'
          onClick={() => history.push('/newlisting')}
          sx={{
            mt: 2,
            ml: 1,
            mb: 1,
            width: '95%',
          }}
        >
          + Create New Listing
        </Button>
      ) : <div></div>}
    </div>
  );
};

export default SideBarTopContent;
