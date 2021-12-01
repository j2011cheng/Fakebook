import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

import Filters from './Filters';

/**
 * Search Bar
 * Also create listings
 *
 * @return {object} JSX
 */
function NewListing() {
  // return (<div></div>);
  let x;

  return (
    <div>
      {/* potentially swap to breadcrumbs component */}
      {/* swap to breadcrumbs api later if needed */}
      <ListSubheader sx={{marginBottom: '-15px'}}>
        {`Marketplace > ${x}`}
        {/* | x = categorySelected */}
      </ListSubheader>
      <ListItem sx={{marginBottom: '-20px'}}>
        <Typography variant="h5">
          {`${x}`}
          {/* | x = categorySelected */}
        </Typography>
      </ListItem>
      <ListItem component='form' sx={{marginBottom: '-15px'}}>
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
          {/* search icon press calls search functionality */}
        </Button>
      </ListItem>
      <ListItem sx={{marginBottom: '10px'}}>
        <Button
          variant="contained"
          fullWidth
        >
          + Create New Listing
          {/* need to add functionality */}
        </Button>
      </ListItem>
    </div>
  );
}

/**
 * Primary filter
 *
 * @return {object} JSX
 */
function Categories() {
  // return (<div></div>);
  return (
    <div>
      <ListSubheader>Categories</ListSubheader>
      <ListItem>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Vehicles" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Computers" />
      </ListItem>
    </div>
  );
}

const drawerWidth = 400;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * Drawer Component (Side Bar)
 *
 * @return {object} JSX
 */
function SideBar() {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar
        sx={{
          height: 75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      />
      <NewListing/>
      <Divider/>
      <Filters/>
      <Divider/>
      <Categories/>
    </Drawer>
  );
}

export default SideBar;
