import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import {useHistory, useLocation} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/AccountCircle';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

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
  const location = useLocation();

  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loginName, setLoginName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState(
    localStorage.getItem('user') ? true : false);

  const handleLoginNameChange = (event) => {
    const {value} = event.target;
    setLoginName(value);
  };

  const handlePasswordChange = (event) => {
    const {value} = event.target;
    setPassword(value);
  };

  const logout = (event) => {
    localStorage.removeItem('user');
    setUser(false);
    setLoginName('');
    setPassword('');
    myListings(false);
    // history.push('/');
  };

  const myListings = (event) => {
    setMenuOpen(false);
    const params = new URLSearchParams(location.search);
    if (event) {
      params.set('owner', JSON.parse(localStorage.getItem('user')).owner.id);
      params.delete('category');
    } else {
      params.delete('owner');
    }
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (loginName === '' || password === '') {
      history.push('/login');
    } else {
      await fetch('/v0/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          loginName: loginName,
          password: password,
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
          setUser(true);
          history.push('/');
        })
        .catch((err) => {
          if (err.status === 401) {
            alert('Invalid login credentials');
          } else {
            alert('Server Error');
          }
        });
      setLoginName('');
      setPassword('');
    }
  };

  const mobileMenu = (
    <div>
      <IconButton
        color='primary'
        aria-label='toggle drawer'
        edge='start'
        onClick={() => setMenuOpen(true)}
        className='menuButton'
      >
        <MenuIcon
          fontSize='large'
        />
      </IconButton>
      <Drawer
        anchor='right'
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Toolbar
          sx={{
            height: 75,
          }}
        />
        {user ? (
          <List>
            <ListItem>
              <Button
                type='submit'
                value='Submit'
                variant='contained'
                sx={{
                  mt: 2,
                  width: 200,
                }}
                onClick={() => history.push('/newlisting')}
              >
                Create New Listing
              </Button>
            </ListItem>
            <ListItem>
              <Button
                type='submit'
                value='Submit'
                variant='contained'
                sx={{
                  mt: 2,
                  mb: 2,
                  width: 200,
                }}
                onClick={myListings}
              >
                My Listings
              </Button>
            </ListItem>
            <Divider/>
            <ListItem>
              <Button
                type='submit'
                value='Submit'
                variant='contained'
                aria-label='log out'
                sx={{
                  mt: 2,
                  width: 200,
                }}
                onClick={logout}
              >
                Log Out
              </Button>
            </ListItem>
          </List>
        ) : (
          <ListItem>
            <Box
              component='form'
            >
              <TextField
                type='text'
                aria-label='email or phone'
                placeholder='Email or Phone Number'
                onChange={handleLoginNameChange}
                value={loginName}
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
                aria-label='password'
                placeholder='Password'
                onChange={handlePasswordChange}
                value={password}
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
                aria-label='log in'
                variant='contained'
                margin='normal'
                sx={{
                  mt: 2,
                  mb: 2,
                  width: 200,
                }}
                onClick={onSubmit}
              >
                Log In
              </Button>
            </Box>
          </ListItem>
        )}
      </Drawer>
    </div>
  );

  const desktopMenu = (
    user ? (
      <div>
        <Button
          variant='contained'
          name='new listing'
          onClick={() => history.push('/newlisting')}
          sx={{
            mt: 2,
            mb: 2,
            ml: 1,
            justifyContent: 'flex-end',
          }}
        >
          + Create New Listing
        </Button>
        <Button
          type='submit'
          value='Submit'
          variant='contained'
          margin='normal'
          sx={{
            mt: 2,
            mb: 2,
            ml: 1,
            justifyContent: 'flex-end',
          }}
          onClick={myListings}
        >
          My Listings
        </Button>
        <Button
          type='submit'
          value='Submit'
          aria-label='logout'
          variant='contained'
          margin='normal'
          sx={{mt: 2, mb: 2, ml: 1, justifyContent: 'flex-end'}}
          onClick={logout}
        >
          Log Out
        </Button>
      </div>
    ) : (
      <Box
        component='form'
      >
        <TextField
          type='text'
          aria-label='email or phone'
          placeholder='Email or Phone Number'
          onChange={handleLoginNameChange}
          value={loginName}
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
          aria-label='password'
          placeholder='Password'
          onChange={handlePasswordChange}
          value={password}
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
          aria-label='log in'
          variant='contained'
          margin='normal'
          sx={{mt: 2, mb: 2, ml: 1, justifyContent: 'flex-end'}}
          onClick={onSubmit}
        >
          Log In
        </Button>
      </Box>
    )
  );

  return (
    <AppBar
      position='fixed'
      elevation={1}
      className={classes.appBar}
    >
      <Toolbar
        sx={{
          backgroundColor: 'white',
          height: 75,
          display: 'flex',
        }}
      >
        <Typography variant='h4' sx={{flexGrow: 1, color: '#1976d2'}}>
          Fakebook
        </Typography>
        {
          width <= 600 ?
            mobileMenu :
            desktopMenu
        }
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
