import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

// const drawerWidth = 400;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

/**
 * @return {object} JSX
 */
function TopBar() {
  const classes = useStyles();
  const history = useHistory();

  const signIn = (event) => {
    history.push('/login');
  };

  // if signed in, show an account badge, otherwise show a fast login...
  // only login button for mobile and fast login for desktop...

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar
        sx={{
          height: 75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Typography variant="h4" sx={{flexGrow: 1}}>
          Fakebook
        </Typography>
        {/* <Box
              component='form'
              onSubmit={onSubmit}
              noValidate sx={{mt: 1}}
            >
              <TextField
                // may need to adjust...
                type={'email' || 'text'}
                name={'email' || 'phone'}
                placeholder='Email or Phone Number'
                onChange={handleInputChange}
                required
                margin='normal'
                fullWidth
                autoFocus
              />
              <TextField
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleInputChange}
                required
                margin='normal'
                fullWidth
              />
              <Button
                type='submit'
                value='Submit' // maybe remove
                fullWidth
                variant='contained'
                sx={{mt: 3, mb: 2}}
              >
                Log In
              </Button> */}
        <Button onClick={signIn}
          variant="h5"
          component="div"
          sx={{justifyContent: 'flex-end'}}>
          Log In
        </Button>
        {/* </Box> */}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
