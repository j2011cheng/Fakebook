import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useHistory} from 'react-router-dom';
import Divider from '@mui/material/Divider';
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
    event.preventDefault();
    history.push('/newuser');
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
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
          <Box component='form' sx={{mt: 1}} noValidate>
            <TextField
              margin='normal'
              required
              type={'text'}
              name={'loginName'}
              aria-label='email or phone number'
              placeholder='Email or Phone Number'
              id='email or phone number'
              label='Email or Phone Number'
              onChange={handleInputChange}
              fullWidth
              autoFocus
            />
            <TextField
              margin='normal'
              required
              type='password'
              name='password'
              aria-label='password'
              placeholder='Password'
              label='Password'
              id='password'
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              type='submit'
              name='submit'
              aria-label='log in'
              value='Login'
              fullWidth
              variant='contained'
              sx={{mt: 2, mb: 2}}
              onClick={onSubmit}
            >
              Log In
            </Button>
            <Divider>or</Divider>
            <Button
              type='submit'
              name='submit'
              aria-label='create new account'
              value='Newuser'
              fullWidth
              variant='contained'
              sx={{mt: 2}}
              onClick={onNewClick}
            >
              Create New Account
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
