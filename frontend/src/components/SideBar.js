import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

import SideBarTopContent from './SideBarTopContent';
// import Filters from './Filters';
import Categories from './Categories';


const drawerWidth = 400;

/**
 * Drawer Component (Side Bar)
 *
 * @param {props} props
 * @return {object} JSX
 */
function SideBar(props) {
  // const {window} = props;
  const [mobileOpen] = React.useState(false);

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  // onClose={handleDrawerToggle}
  // , setMobileOpen

  // const container =
  //   window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component='nav'
      sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
      aria-label='sidebar'
    >
      {/* Mobile View */}
      <Drawer
        variant='temporary'
        open={mobileOpen}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          'display': {xs: 'block', sm: 'none'},
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
      </Drawer>
      {/* Desktop View */}
      <Drawer
        variant='permanent'
        sx={{
          'display': {xs: 'none', sm: 'block'},
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        <Toolbar sx={{mb: 1}}/>
        <SideBarTopContent/>
        <Divider/>
        {/* <Filters/>*/}
        <Divider/>
        <Categories/>
      </Drawer>
    </Box>
  );
}

export default SideBar;
