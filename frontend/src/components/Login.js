import React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useHistory} from 'react-router-dom';

/**
 * @return {object} JSX
 */
function Login() {
  const [user, setUser] = React.useState({loginName: '', password: ''});
  const history = useHistory();

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

  const onNewClick = (event) => {
    history.push('/newuser');
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Fakebook
        </Typography>
        <Box
          component='form'
          sx={{mt: 1}}
        >
          <TextField
            type={'text'}
            name={'loginName'}
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
            name='submit'
            value='Login'
            fullWidth
            variant='contained'
            sx={{mt: 3, mb: 2}}
            onClick={onSubmit}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item>
              <Link href='' variant='body2' onClick={onNewClick}>
                Create new account
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
