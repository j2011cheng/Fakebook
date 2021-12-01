import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
// import {makeStyles} from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import TopBar from './TopBar';
import SideBar from './SideBar';
import Body from './Body';

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
        <Body/>
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
