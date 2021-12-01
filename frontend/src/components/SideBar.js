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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

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
 * Secondary Filter
 * Populate data based on category selected
 *
 * @return {object} JSX
 */
function Subcategory() {
  let x;
  // return (<div></div>);

  if (x === 'Computers') { // x === categorySelected
    return (
      <div>
        <ListItem sx={{marginBottom: '-15px'}}>
          <ListItemText primary="Filters" />
          {/* add by distance functionality*/}
        </ListItem>
        <ListItem sx={{marginBottom: '-15px'}}>
          <ListItemText primary="Price" />
          <MinMax/>
        </ListItem>
        <ListItem>
          <ListItemText primary="OS" />
          <DropDown/>
        </ListItem>
      </div>
    );
  } else {
    return (
      <div>
        <ListItem sx={{marginBottom: '-15px'}}>
          <ListItemText primary="Filters" />
          {/* add by distance functionality*/}
        </ListItem>
        <ListItem sx={{marginBottom: '-15px'}}>
          <ListItemText primary="Price" />
          <MinMax/>
        </ListItem>
        <ListItem>
          <ListItemText primary="Year" />
          <MinMax/>
        </ListItem>
      </div>
    );
  }
}

/**
 * Primary filter
 *
 * @return {object} JSX
 */
function Category() {
  // return (<div></div>);
  return (
    <div>
      <ListSubheader>Categories</ListSubheader>
      <ListItem> {/* button onClick={() => setCategorySelected('Vehicles')} */}
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Vehicles" />
      </ListItem>
      <ListItem> {/* button onClick={() => setCategorySelected('Computers')} */}
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Computers" />
      </ListItem>
    </div>
  );
}

/**
 * Dropdown Menu - helper function
 *
 * @return {object} JSX
 */
function DropDown() {
  // prob have an onsubmit func here

  const [personName, setPersonName] = React.useState([]);
  const names = ['Windows', 'Mac', 'Linux'];

  const handleChange = (event) => {
    const {
      target: {value},
    } = event;
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{m: 1, width: 300}}>
        <InputLabel id="demo-multiple-checkbox-label">Brand</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

/**
 * Price Range - helper function
 *
 * @return {object} JSX
 */
function MinMax() {
  // prob have an onsubmit func here

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <ListItem>
        <TextField
          id="filled-basic"
          label="Min"
          variant="filled"
          sx={{width: '125px', marginLeft: '45px'}}/>
        <ListItemText
          sx={{width: '45px', textAlign: 'center'}}>
          to
        </ListItemText>
        <TextField
          id="filled-basic"
          label="Max"
          variant="filled"
          sx={{width: '125px'}}/>
      </ListItem>
    </Box>
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
      <NewListing />
      <Divider />
      <Subcategory />
      <Divider />
      <Category />
    </Drawer>
  );
}

export default SideBar;
