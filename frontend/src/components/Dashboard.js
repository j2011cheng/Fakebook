import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import TopBar from './TopBar';
import SideBar from './SideBar';
import Body from './Body';

/**
 * Dashboard Content.
 *
 * @return {object} JSX
 */
function DashboardContent() {
  // probably use a 'loggedin' state to show/hide things

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <TopBar/>
      <SideBar/>
      <Body/>
    </Box>
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
