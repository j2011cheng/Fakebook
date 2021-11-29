import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import Breadcrumbs from '@mui/material/Breadcrumbs';

/**
 * Search Bar
 * Also create listings
 *
 * @return {object} JSX
 */
export default function NewListing() {
  return (
    <div>
      {/* breadcrumbs */}
      {/* swap to breadcrumbs api later if needed */}
      <ListSubheader>
        {'Marketplace > Vehicles'}
      </ListSubheader>

      {/* change to be reactive name */}
      <ListItem>
        <Typography variant="h5">
          Vehicles
        </Typography>
      </ListItem>

      {/* search bar */}
      <Box component='form'>
        <ListItem>
          <TextField
            type='text'
            name='search'
            placeholder='Search Marketplace'
            margin='normal'
            fullWidth
            size="small"
            sx={{marginBottom: '16px'}}
            // some form submission func...
            // for some reason changes scene?
          />
          <Button
            variant="outlined"
            size="large"
          >
            <SearchIcon/>
            {/* add search functionality */}
          </Button>
        </ListItem>
        {/* want to reduce spacing between the search box... */}
      </Box>

      {/* create new listing button */}
      <ListItem>
        <Button
          variant="contained"
          fullWidth
        >
          + Create New Listing
          {/* need to add functionality */}
        </Button>
      </ListItem>

      {/* can use text field for drop down menus */}
    </div>
  );
}

/**
 * Secondary Filter
 * Populate data based on category selected
 *
 * @return {object} JSX
 */
export function Subcategory() {
  return (
    <div>
      <ListSubheader>Subcategories</ListSubheader> {/* temporary */}
      <ListItem>
        <ListItemText primary="Filters" />
        {/* by distance */}
      </ListItem>
      <ListItem>
        <ListItemText primary="Price" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Year" />
      </ListItem>
      {/* more filters... */}
    </div>
  );
}

/**
 * Primary filter
 *
 * @return {object} JSX
 */
export function Category() {
  return (
    <div>
      <ListSubheader>Categories</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Vehicles" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Apparel" />
      </ListItem>
    </div>
  );
}
