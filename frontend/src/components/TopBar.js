import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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

  // const signIn = (event) => {
  //   history.push('/login');
  // };

  const [user, setUser] = React.useState({loginName: '', password: ''});

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/v0/authenticate', {
      method: 'POST',
      body: JSON.stringify({
        loginName: user.loginName,
        password: user.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));
        history.push('/');
      })
      .catch((err) => {
        setUser({email: '', password: ''});
        if (err.status === 401) {
          alert('Invalid login credentials');
        } else {
          alert('Server Error');
        }
      });
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
        <Box
          component='form'
        >
          <TextField
            type={'text'}
            name={'loginName'}
            placeholder='Email or Phone Number'
            onChange={handleInputChange}
            required
            margin='normal'
            autoFocus
          />
          <TextField
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleInputChange}
            required
            margin='normal'
          />
          <Button
            type='submit'
            value='Submit'
            variant='contained'
            margin='normal'
            sx={{mt: 3, mb: 2, justifyContent: 'flex-end'}}
            onClick={onSubmit}
          >
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
