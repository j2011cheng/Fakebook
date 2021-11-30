import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';

import NewListing, {Subcategory, Category} from './Filters';
import {GlobalContext} from './App';

const drawerWidth = 400;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },
}));

/**
 * Dashboard Content.
 *
 * @return {object} JSX
 */
function DashboardContent() {
  const classes = useStyles();

  const {page} = React.useContext(GlobalContext);
  const [pageView, setPageView] = page;
  console.log(pageView, setPageView);

  // probably use a 'loggedin' state to show/hide things

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
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
            <Button onClick={() => setPageView('Sign-In')}
              variant="h5"
              component="div"
              sx={{justifyContent: 'flex-end'}}>
              Log In
            </Button>
            {/* </Box> */}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar
            sx={{
              height: 75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          />
          <NewListing />
          <Divider />
          <Subcategory />
          <Divider />
          <Category />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ?
                theme.palette.grey[100] :
                theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container sx={{mt: 4, mb: 4, ml: 0, mr: 0}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    // width: '100%',
                  }}
                >
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'sflex',
                    flexDirection: 'column',
                  }}>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

/**
 * Dashboard.
 *
 * @return {object} JSX
 */
export default function Dashboard() {
  return <DashboardContent />;
}
