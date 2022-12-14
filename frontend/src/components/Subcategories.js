import React from 'react';
import Paper from '@mui/material/Paper';
// import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useHistory, useLocation} from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import Categories from './Categories';
import Search from './Search';
import FilterDialogButton from './FilterDialogButton';
// import BreadSlices from './BreadSlices';

/**
 * Category chips section of body
 *
 * @return {object} JSX
 */
function Subcategories() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // https://stackoverflow.com/questions/19014250/
  // rerender-view-on-browser-resize-with-react
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleClickOpen = () => {
    setMobileOpen(true);
  };
  const handleClose = () => {
    setMobileOpen(false);
  };

  const location = useLocation();
  const history = useHistory();

  const [category, setCategory] = React.useState(
    new URLSearchParams(location.search).get('category'));
  React.useEffect(() => {
    setCategory(new URLSearchParams(location.search).get('category'));
    handleClose();
  }, [location.search]);

  const setCategoryParam = (id) => {
    return () => {
      const params = new URLSearchParams();
      params.set('category', id);
      history.push(`/?${params.toString()}`);
    };
  };
  const allCategories = () => {
    const params = new URLSearchParams();
    params.delete('category');
    history.push(`/?${params.toString()}`);
  };

  const mobileAllCategories = () => {
    return (
      <Drawer
        anchor='top'
        open={mobileOpen}
        onClose={handleClose}
      >
        <Paper
          sx={{
            height: window.innerHeight,
          }}
        >
          <Toolbar
            sx={{
              height: 75,
              display: 'flex',
            }}
          />
          <List>
            <ListItem
              sx={{
                width: '100%',
              }}
            >
              <Typography variant='h4' sx={{flexGrow: 1}}>
                Categories
              </Typography>
              <IconButton
                onClick={handleClose}
                aria-label='close'
              >
                <CloseIcon fontSize='large'/>
              </IconButton>
            </ListItem>
            <ListItem
              sx={{
                width: 400,
              }}
            >
              <Categories/>
            </ListItem>
          </List>
        </Paper>
      </Drawer>
    );
  };

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      let request = '/v0/category';
      if (category) {
        request += `?category=${category}`;
      }
      const disp = await fetch(request, {
        method: 'GET',
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          return json.subcategories;
        })
        .catch((err) => {
          if (err.status === 404) {
            alert('Category does not exist');
          } else {
            alert('Subcategories Server Error');
          }
          return [];
        });
      setData(disp);
    };
    getData();
  }, [category]);

  const subcategory = ({name, id}) => {
    return (
      <Box
        key={id}
        sx={{mr: 1}}
      >
        <Chip
          label={name}
          aria-label={name}
          onClick={setCategoryParam(id)}
        />
      </Box>
    );
  };

  const getStack = () => {
    if (width <= 600) {
      return (
        <div style={{width: '100%'}}>
          <Box
            sx={{
              display: 'flex',
              overflow: 'auto',
              p: 1,
              m: 1,
            }}
          >
            <Box sx={{ml: -1, mr: 1}}>
              <Chip
                label={'All Categories'}
                onClick={handleClickOpen}
              />
            </Box>
            <Box sx={{mr: 1}}><FilterDialogButton/></Box>
            {data.map(subcategory)}
          </Box>
        </div>
      );
    } else {
      return (
        <div>
          <Box
            sx={{
              display: 'flex',
              overflow: 'auto',
              p: 1,
              m: 1,
            }}
          >
            <Box sx={{ml: -1, mr: 1}}>
              <Chip
                label={'All Categories'}
                onClick={allCategories}
              />
            </Box>
            {data.map(subcategory)}
          </Box>
        </div>
      );
    }
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          width: 'auto',
        }}
      >
        <Search/>
        {getStack()}
      </Paper>
      {mobileOpen && mobileAllCategories()}
    </Grid>
  );
};

export default Subcategories;
