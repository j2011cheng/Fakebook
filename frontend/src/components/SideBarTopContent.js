import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

/**
 *
 * @return {object} JSX
 */
function SideBarTopContent() {
  const [search, setSearch] = React.useState('');

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const submitSearch = () => {
    console.log('Search not supported');
    console.log(search);
  };

  const newListing = () => {
    console.log('Creating listings not supported');
  };

  return (
    <div>
      <TextField
        type='text'
        name='search field'
        placeholder='Search Marketplace'
        margin='normal'
        size='small'
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
      <Button
        variant='contained'
        name='new listing'
        onClick={newListing}
        sx={{ml: 1, mb: 1, width: '95%'}}
      >
        + Create New Listing
      </Button>
    </div>
  );
};

export default SideBarTopContent;
