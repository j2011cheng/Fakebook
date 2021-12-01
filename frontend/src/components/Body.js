import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {Typography} from '@mui/material';

/**
 * Advertisement section of body
 *
 * @return {object} JSX
 */
function Advertisement() {
  // if signed in, replace login button with acc badge
  // (use from topbar when done)

  const history = useHistory();

  const signIn = (event) => {
    history.push('/login');
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
        }}
      >
        <ListItemText sx={{mt: -1}}>
          <Typography variant='h5'>
            Buy and sell items locally or have
            something new shipped from stores.
          </Typography>
        </ListItemText>
        <ListItemText sx={{mt: -1}}>
          <Typography variant='h6'>
            Log in to get the full
            Fakebook Marketplace experience.
          </Typography>
        </ListItemText>
        <ListItem>
          <Button
            variant='contained'
            onClick={signIn}
            sx={{ml: -2, mr: 1, mt: 1, width: '50%'}}>
            Login
          </Button>
          <Button
            variant='contained'
            fullWidth
            sx={{ml: 1, mr: -2, mt: 1, width: '50%'}}>
            Learn More
          </Button>
        </ListItem>
      </Paper>
    </Grid>
  );
}

/**
 * Category chips section of body
 *
 * @return {object} JSX
 */
function BodyCategory() {
  // can possibly pull from filter.js/sidebar to complete

  // --- Mobile ---
  // breadcrumbs
  // category selection (dropdown)
  // subcategory selection (chips)
  // search bar
  // location filter
  // category specific filters

  // --- Desktop ---
  // Shop by category text
  // category chips

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 100,
        }}
      >
        <ListItemText sx={{mt: -1}}>
          <Typography variant='h5'>Shop by Category</Typography>
        </ListItemText>
        <Stack direction='row' spacing={1}>
          <Chip label='Vehicles' variant='outlined' onClick={handleClick}/>
          <Chip label='Computers' variant='outlined' onClick={handleClick}/>
        </Stack>
      </Paper>
    </Grid>
  );
}

/**
 * Show listings section of body
 *
 * @return {object} JSX
 */
function ShowListings() {
  // listings shown

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: 'sflex',
          flexDirection: 'column',
        }}>
      </Paper>
    </Grid>
  );
}

/**
 *
 * @return {object} JSX
 */
function Body() {
  return (
    <Box>
      <Toolbar/>
      <Container sx={{mt: 4, mb: 4, ml: '50%', mr: '50%'}}>
        <Grid container spacing={3}>
          <Advertisement/>
          <BodyCategory/>
          <ShowListings/>
        </Grid>
      </Container>
    </Box>
  );
}

export default Body;
