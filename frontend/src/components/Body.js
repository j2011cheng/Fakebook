import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import ListingList from './ListingList';
import Subcategories from './Subcategories';

// /**
//  * Advertisement section of body
//  *
//  * @return {object} JSX
//  */
// function Advertisement() {
//   // if signed in, replace login button with acc badge
//   // (use from topbar when done)
//
//   const history = useHistory();
//
//   const signIn = (event) => {
//     history.push('/login');
//   };
//
//   return (
//     <Grid item xs={12}>
//       <Paper
//         sx={{
//           p: 2,
//           display: 'flex',
//           flexDirection: 'column',
//           height: 150,
//         }}
//       >
//         <ListItemText sx={{mt: -1}}>
//           <Typography variant='h5'>
//             Buy and sell items locally or have
//             something new shipped from stores.
//           </Typography>
//         </ListItemText>
//         <ListItemText sx={{mt: -1}}>
//           <Typography variant='h6'>
//             Log in to get the full
//             Fakebook Marketplace experience.
//           </Typography>
//         </ListItemText>
//         <ListItem>
//           <Button
//             variant='contained'
//             onClick={signIn}
//             sx={{ml: -2, mr: 1, mt: 1, width: '50%'}}>
//             Login
//           </Button>
//           <Button
//             variant='contained'
//             fullWidth
//             sx={{ml: 1, mr: -2, mt: 1, width: '50%'}}>
//             Learn More
//           </Button>
//         </ListItem>
//       </Paper>
//     </Grid>
//   );
// }

/**
 *
 * @return {object} JSX
 */
function Body() {
  return (
    <Box>
      <Toolbar/>
      <Container sx={{mt: 4, mb: 4}}>
        <Grid container spacing={3}>
          <Subcategories/>
          <ListingList/>
        </Grid>
      </Container>
    </Box>
  );
}

export default Body;
