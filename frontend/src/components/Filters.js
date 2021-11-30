import * as React from 'react';
// import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import ListSubheader from '@mui/material/ListSubheader';
// import TextField from '@mui/material/TextField';
// import SearchIcon from '@mui/icons-material/Search';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Checkbox from '@mui/material/Checkbox';
// import Box from '@mui/material/Box';


/**
 * Search Bar
 * Also create listings
 *
 * @return {object} JSX
 */
export default function NewListing() {
  return (<div></div>);
  // return (
  //   <div>
  //     {/* breadcrumbs */}
  //     {/* swap to breadcrumbs api later if needed */}
  //     <ListSubheader sx={{marginBottom: '-15px'}}>
  //       {`Marketplace > ${categorySelected}`}
  //     </ListSubheader>
  //
  //     {/* change to be reactive name */}
  //     <ListItem sx={{marginBottom: '-20px'}}>
  //       <Typography variant="h5">
  //         {`${categorySelected}`}
  //       </Typography>
  //     </ListItem>
  //
  //     {/* search bar */}
  //     <ListItem component='form' sx={{marginBottom: '-15px'}}>
  //       <TextField
  //         type='text'
  //         name='search'
  //         placeholder='Search Marketplace'
  //         margin='normal'
  //         fullWidth
  //         size="small"
  //         sx={{marginBottom: '16px'}}
  //         // some form submission func...
  //         // for some reason changes scene?
  //       />
  //       <Button
  //         variant="outlined"
  //         size="large"
  //       >
  //         <SearchIcon/>
  //         {/* add search functionality */}
  //       </Button>
  //     </ListItem>
  //
  //     {/* create new listing button */}
  //     <ListItem sx={{marginBottom: '10px'}}>
  //       <Button
  //         variant="contained"
  //         fullWidth
  //       >
  //         + Create New Listing
  //         {/* need to add functionality */}
  //       </Button>
  //     </ListItem>
  //   </div>
  // );
}

/**
 * Secondary Filter
 * Populate data based on category selected
 *
 * @return {object} JSX
 */
export function Subcategory() {
  return (<div></div>);
  // if (categorySelected === 'Computers') {
  //   return (
  //     <div>
  //       <ListItem sx={{marginBottom: '-15px'}}>
  //         <ListItemText primary="Filters" />
  //         {/* add by distance functionality*/}
  //       </ListItem>
  //       <ListItem sx={{marginBottom: '-15px'}}>
  //         <ListItemText primary="Price" />
  //         <MinMax/>
  //       </ListItem>
  //       <ListItem>
  //         <ListItemText primary="OS" />
  //         <Dropdown/>
  //       </ListItem>
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div>
  //       <ListItem sx={{marginBottom: '-15px'}}>
  //         <ListItemText primary="Filters" />
  //         {/* add by distance functionality*/}
  //       </ListItem>
  //       <ListItem sx={{marginBottom: '-15px'}}>
  //         <ListItemText primary="Price" />
  //         <MinMax/>
  //       </ListItem>
  //       <ListItem>
  //         <ListItemText primary="Year" />
  //         <MinMax/>
  //       </ListItem>
  //     </div>
  //   );
  // }
}

/**
 * Primary filter
 *
 * @return {object} JSX
 */
export function Category() {
  return (<div></div>);
  // return (
  //   <div>
  //     <ListSubheader>Categories</ListSubheader>
  //     <ListItem button onClick={() => setCategorySelected('Vehicles')}>
  //       <ListItemIcon>
  //         <AssignmentIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Vehicles" />
  //     </ListItem>
  //     <ListItem button onClick={() => setCategorySelected('Computers')}>
  //       <ListItemIcon>
  //         <AssignmentIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Computers" />
  //     </ListItem>
  //   </div>
  // );
}

// /**
//  * Dropdown Menu - helper function
//  *
//  * @return {object} JSX
//  */
// function Dropdown() {
//   const [personName, setPersonName] = React.useState([]);
//   const names = ['Windows', 'Mac', 'Linux'];
//
//   const handleChange = (event) => {
//     const {
//       target: {value},
//     } = event;
//     setPersonName(
//       // On autofill we get a the stringified value.
//       typeof value === 'string' ? value.split(',') : value,
//     );
//   };
//
//   return (
//     <div>
//       <FormControl sx={{m: 1, width: 300}}>
//         <InputLabel id="demo-multiple-checkbox-label">Brand</InputLabel>
//         <Select
//           labelId="demo-multiple-checkbox-label"
//           id="demo-multiple-checkbox"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={<OutlinedInput label="Tag" />}
//           renderValue={(selected) => selected.join(', ')}
//         >
//           {names.map((name) => (
//             <MenuItem key={name} value={name}>
//               <Checkbox checked={personName.indexOf(name) > -1} />
//               <ListItemText primary={name} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
//
// /**
//  * Dropdown Menu - helper function
//  *
//  * @return {object} JSX
//  */
// function MinMax() {
//   return (
//     <Box
//       component="form"
//       noValidate
//       autoComplete="off"
//     >
//       <ListItem>
//         <TextField
//           id="filled-basic"
//           label="Min"
//           variant="filled"
//           sx={{width: '125px', marginLeft: '45px'}}/>
//         <ListItemText
//           sx={{width: '45px', textAlign: 'center'}}>
//           to
//         </ListItemText>
//         <TextField
//           id="filled-basic"
//           label="Max"
//           variant="filled"
//           sx={{width: '125px'}}/>
//       </ListItem>
//     </Box>
//   );
// }
