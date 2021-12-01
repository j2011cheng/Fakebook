import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

/**
 * @return {object} JSX
 */
function Body() {
  // file for body of front end (similar to filters.js)

  // buy and sell description area with login button...

  // breadcrumbs
  // category selection area with listings search

  // listings shown
  //    distance filter

  // if signed in, show an account badge, otherwise show a fast login...
  // only login button for mobile and fast login for desktop...

  return (
    <Box
      component='main'
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ?
            theme.palette.grey[100] :
            theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container sx={{mt: 4, mb: 4, ml: 0, mr: 0}}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                // width: '100%',
              }}
            >
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'sflex',
                flexDirection: 'column',
              }}>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Body;
