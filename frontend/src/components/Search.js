import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import {useLocation, useHistory} from 'react-router-dom';

/**
 *
 * @return {object} JSX
 */
function Search() {
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = React.useState(
    new URLSearchParams(location.search).get('search'));

    const handleInputChange = (event) => {
      setSearch(event.target.value);
    };

    const submitSearch = () => {
      const params = new URLSearchParams(location.search);
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      setSearch('');
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
          sx={{ml: 1, mb: 1, width: '75%'}}
        />
        <Button
          variant='outlined'
          size='large'
          name='search'
          onClick={submitSearch}
          sx={{mt: 2, width: '20%'}}
        >
          <SearchIcon/>
        </Button>
      </div>
    );
};

export default Search;
