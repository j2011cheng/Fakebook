import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import {useHistory} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const steps = [
  {
    label: 'Enter Name',
    description: (
      <Grid item xs={12}>
        <TextField
          type='text'
          name='name'
          placeholder='Name'
          onChange={() => console.log('owo')}
          required
          fullWidth
          autoFocus
        />
      </Grid>
    ),
  },
  {
    label: 'Enter Email',
    description: (
      <Grid item xs={12}>
        <TextField
          required
          type='text'
          name='email'
          placeholder='Email'
          onChange={() => console.log('owo')}
          fullWidth
        />
      </Grid>
    ),
  },
  {
    label: 'Enter Phone Number',
    description: (
      <Grid item xs={12}>
        <TextField
          type='text'
          name='phone'
          placeholder='Phone Number'
          onChange={() => console.log('owo')}
          fullWidth
        />
      </Grid>
    ),
  },
  {
    label: 'Enter Password',
    description: (
      <Grid item xs={12}>
        <TextField
          required
          type='password'
          name='password'
          placeholder='Password'
          onChange={() => console.log('owo')}
          fullWidth
        />
      </Grid>
    ),
  },
];

/**
 * @return {object} JSX
 */
export default function TempNewUser() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [user, setUser] =
    React.useState({name: '', phone: '', email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    event.preventDefault();
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
        <Typography component='h1' variant='h5' align='center'>
            Fakebook
        </Typography>
        <Box component='form'>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{mb: 2}}>
                    <div>
                      <Button
                        variant='contained'
                        onClick={handleInputChange}
                        sx={{mt: 1, mr: 1}}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{mt: 1, mr: 1}}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <ListItem>
              <Typography sx={{ml: 2, mt: 2}}>Finish signing up!</Typography>
              <Button
                type='submit'
                value='Submit'
                variant='contained'
                sx={{ml: 2, mt: 2}}
                onClick={onSubmit}
              >
                Sign Up
              </Button>
            </ListItem>
          )}
          <ListItem>
            <Typography sx={{ml: 2, mt: 2}}>
              Already have an account?
            </Typography>
            <Button
              variant='contained'
              onClick={signIn}
              sx={{mt: 2, ml: 2}}
            >
              Log In
            </Button>
          </ListItem>
        </Box>
      </Box>
    </Container>
  );
}
