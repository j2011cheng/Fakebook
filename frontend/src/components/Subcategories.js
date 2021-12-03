import React from 'react';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useHistory, useLocation} from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@mui/material/Dialog';
// import ListItem from '@mui/material/ListItem';
// import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Slide from '@mui/material/Slide';

import Categories from './Categories';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

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

  const setCategory = (id) => {
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
      <div>
        <Dialog
          fullScreen
          open={mobileOpen}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{position: 'relative'}}>
            <Toolbar
              sx={{
                backgroundColor: 'white',
                height: 75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography variant='h4' sx={{flexGrow: 1, color: '#1976d2'}}>
                Select Category
              </Typography>
              <IconButton
                onClick={handleClose}
                aria-label='close'
                sx={{justifyContent: 'flex-end', color: '#1976d2'}}
              >
                <CloseIcon fontSize='large'/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Toolbar sx={{height: 75}}/>
          {/* replace the list with your backend list @graham */}
          <Categories/>
        </Dialog>
      </div>
    );
  };

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      let request = '/v0/category';
      if (params.get('category')) {
        request += `?category=${params.get('category')}`;
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
  }, [location.search]);

  const subcategory = ({name, id}) => {
    return (
      <Chip
        key={id}
        label={name}
        onClick={setCategory(id)}
      />
    );
  };

  const getStack = () => {
    if (width <= 600) {
      return (
        <Stack
          direction='row'
          spacing={1}
          variant='temporary'
          sx={{
            'display': {xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
        >
          <Chip
            label={'All Categories'}
            onClick={handleClickOpen}
          />
          {data.map(subcategory)}
        </Stack>
      );
    } else {
      return (
        <Stack
          direction='row'
          spacing={1}
          variant='permanent'
          sx={{
            'display': {xs: 'none', sm: 'block'},
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
        >
          <Chip
            label={'All Categories'}
            onClick={allCategories}
          />
          {data.map(subcategory)}
        </Stack>
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
          height: 100,
        }}
      >
        <ListItemText sx={{mt: -1}}>
          <Typography variant='h5'>Shop by Category</Typography>
        </ListItemText>
        {getStack()}
      </Paper>
      {mobileOpen && mobileAllCategories()}
    </Grid>
  );
};

export default Subcategories;
