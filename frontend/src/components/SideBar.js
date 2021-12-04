import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import SideBarTopContent from './SideBarTopContent';
import Filters from './Filters';
import Categories from './Categories';


const drawerWidth = 400;

/**
 * Drawer Component (Side Bar)
 *
 * @param {props} props
 * @return {object} JSX
 */
function SideBar(props) {
  return (
    <Box
      component='nav'
      sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
      aria-label='sidebar'
    >
      <Drawer
        variant='permanent'
        sx={{
          'display': {xs: 'none', sm: 'block'},
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Toolbar sx={{mb: 1}}/>
        <SideBarTopContent/>
        <Divider/>
        <Filters/>
        <Divider/>
        <ListItemText sx={{mt: 1, ml: 1}}>
          <Typography variant='h5'>Categories</Typography>
        </ListItemText>
        <Categories/>
      </Drawer>
    </Box>
  );
}

export default SideBar;
