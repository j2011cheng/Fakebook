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
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Divider from '@mui/material/Divider';

/**
 * @return {object} JSX
 */
function NewUser() {
  const [counterStep, setCounterStep] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleBack = () => {
    setCounterStep(counterStep - 1);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setCounterStep(counterStep + 1);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

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
        } else if (err.status === 400) {
          alert('Must have a valid email');
        } else {
          alert('Server Error');
        }
      });
  };

  const signIn = (event) => {
    event.preventDefault();
    history.push('/login');
  };

  const steps = [
    {
      label: 'Enter Name',
      description: (
        <Grid item xs={12}>
          <TextField
            margin='normal'
            required
            type='text'
            name='name'
            placeholder='Name'
            id='name'
            label='Name'
            aria-label='name'
            onChange={handleInputChange}
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
            margin='normal'
            required
            type='text'
            name='email'
            placeholder='Email'
            id='email'
            label='Email'
            aria-label='email'
            onChange={handleInputChange}
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
            margin='normal'
            type='text'
            name='phone'
            placeholder='Phone Number'
            id='phone number'
            label='Phone Number'
            aria-label='phone number'
            onChange={handleInputChange}
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
            margin='normal'
            required
            type='password'
            name='password'
            placeholder='Password'
            id='password'
            label='Password'
            aria-label='password'
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      ),
    },
  ];

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
          <Typography component='h1' variant='h5' align='center'>
              Fakebook
          </Typography>
          <Box component='form' noValidate>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            <Box sx={{mb: 2, justifyContent: 'center', ml: '25%'}}>
              <Button
                disabled={counterStep===4}
                aria-label='continue'
                onClick={handleNext}
                sx={{mt: 1, mr: 1}}
              >
                Continue
              </Button>
              <Button
                disabled={counterStep===0}
                onClick={handleBack}
                aria-label='back'
                sx={{mt: 1, mr: 1}}
              >
                Back
              </Button>
            </Box>
            {activeStep === steps.length && (
              <ListItem>
                <Button
                  type='submit'
                  name='submit'
                  aria-label='sign up'
                  value='NewUser'
                  variant='contained'
                  fullWidth
                  sx={{mt: 1, mb: 1, width: '325px'}}
                  onClick={onSubmit}
                >
                  Sign Up
                </Button>
              </ListItem>
            )}
            <Divider>or</Divider>
            <ListItem>
              <Button
                type='submit'
                name='submit'
                aria-label='log in'
                value='Login'
                variant='contained'
                onClick={signIn}
                sx={{mt: 1, width: '325px'}}
              >
                Log In
              </Button>
            </ListItem>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default NewUser;
