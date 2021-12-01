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

/**
 * @return {object} JSX
 */
function NewUser() {
  const [user, setUser] =
    React.useState({name: '', phone: '', email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/v0/newuser', {
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
        history.push('/');
      })
      .catch((err) => {
        if (err.status === 409) {
          setUser({name: '', phone: '', email: '', password: ''});
          alert('User already exists');
        } else {
          alert('Server Error');
        }
      });
  };

  const signIn = (event) => {
    history.push('/login');
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
        <Box component="form"
          sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type='text'
                name='name'
                placeholder='Name'
                onChange={handleInputChange}
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type='text'
                name='email'
                placeholder='Email'
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='text'
                name='phone'
                placeholder='Phone Number'
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            value="Submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={onSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='' variant='body2' onClick={signIn}>
                Already have an account?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default NewUser;
