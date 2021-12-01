import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

import SideBarTopContent from './SideBarTopContent';
// import Filters from './Filters';
import Categories from './Categories';

const drawerWidth = 400;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * Drawer Component (Side Bar)
 *
 * @return {object} JSX
 */
function SideBar() {
  const classes = useStyles();

  return (
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
      <SideBarTopContent/>
      <Divider/>
      {/* <Filters/>*/}
      <Divider/>
      <Categories/>
    </Drawer>
  );
}

export default SideBar;
