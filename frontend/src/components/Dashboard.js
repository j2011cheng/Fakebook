import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
// import {makeStyles} from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import TopBar from './TopBar';
import SideBar from './SideBar';

// const drawerWidth = 400;
// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerContainer: {
//     overflow: 'auto',
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(0),
//   },
// }));

/**
 * Dashboard Content.
 *
 * @return {object} JSX
 */
function DashboardContent() {
  // probably use a 'loggedin' state to show/hide things

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
        <TopBar/>
        <SideBar/>
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
