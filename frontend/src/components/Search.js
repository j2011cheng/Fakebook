import React from 'react';
import TextField from '@mui/material/TextField';
import {useLocation, useHistory} from 'react-router-dom';

/**
 *
 * @return {object} JSX
 */
function Search() {
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = React.useState(
    new URLSearchParams(location.search).get('search') || '');

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    const params = new URLSearchParams(location.search);
    if (event.target.value.length > 1) {
      params.set('search', event.target.value);
    } else {
      params.delete('search');
    }
    history.push(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div>
      <TextField
        type='text'
        name='search field'
        placeholder='Search Marketplace'
        margin='normal'
        size='small'
        value={search}
        onInput={handleInputChange}
        sx={{ml: 1, mb: 1, width: '95%'}}
      />
    </div>
  );
};

export default Search;
