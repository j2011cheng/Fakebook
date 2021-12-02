import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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

  const [user, setUser] = React.useState({loginName: '', password: ''});

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const logout = (event) => {
    localStorage.removeItem('user');
    setUser({loginName: '', password: ''});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await fetch('/v0/authenticate', {
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
        if (err.status === 401) {
          alert('Invalid login credentials');
        } else {
          alert('Server Error');
        }
      });
    setUser({email: '', password: ''});
  };

  // if signed in, show an account badge, otherwise show a fast login...
  // only login button for mobile and fast login for desktop...

  return (
    <AppBar position='fixed' elevation={1} className={classes.appBar}>
      <Toolbar
        sx={{
          backgroundColor: 'white',
          height: 75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Typography variant='h4' sx={{flexGrow: 1, color: '#1976d2'}}>
          Fakebook
        </Typography>
        {
          localStorage.getItem('user') ? (
            <Button
              type='submit'
              value='Submit'
              variant='contained'
              margin='normal'
              sx={{mt: 2, mb: 2, ml: 1, justifyContent: 'flex-end'}}
              onClick={logout}
            >
              Log Out
            </Button>
          ) : (
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
                size='small'
                sx={{
                  display: {xs: 'none', md: 'inline-block'},
                  mt: 2, mb: 2, ml: 1, mr: 1, justifyContent: 'flex-end',
                }}
              />
              <TextField
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleInputChange}
                required
                margin='normal'
                size='small'
                sx={{
                  display: {xs: 'none', md: 'inline-block'},
                  mt: 2, mb: 2, ml: 1, mr: 1, justifyContent: 'flex-end',
                }}
              />
              <Button
                type='submit'
                value='Submit'
                variant='contained'
                margin='normal'
                sx={{mt: 2, mb: 2, ml: 1, justifyContent: 'flex-end'}}
                onClick={onSubmit}
              >
                Log In
              </Button>
            </Box>
          )
        }
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
