import React from 'react';
import {useHistory} from 'react-router-dom';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {GlobalContext} from './App';

/**
 * @return {object} JSX
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useHistory();

  const [pageView, setPageView] = React.useContext(GlobalContext);
  console.log('Login.js: \'pageView\' state -', pageView);

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
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        setPageView('Dashboard'); // maybe move later
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        alert('Error logging in, please try again');
      });
  };

  const onNewClick = (event) => {
    history.push('/newuser');
    setPageView('Sign-Up');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Fakebook
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate sx={{mt: 1}}
        >
          <TextField
            type='email'
            name='email'
            placeholder='Email' // may need to add phone number later
            onChange={handleInputChange}
            required
            margin="normal"
            fullWidth
            autoComplete="email"
            autoFocus
          />
          <TextField
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleInputChange}
            required
            margin="normal"
            fullWidth
            autoComplete="current-password"
          />
          <Button
            type="submit"
            value="Submit" // maybe remove
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={() => setPageView('Dashboard')}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" button onClick={onNewClick}>
                {'Create new account'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
