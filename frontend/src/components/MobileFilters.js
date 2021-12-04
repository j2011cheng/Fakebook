import React from 'react';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useHistory, useLocation} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
// import ListItem from '@mui/material/ListItem';
// import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * Filters list
 * Populate data based on category selected
 *
 * @return {object} JSX
 */
function MobileFilters() {
  const history = useHistory();
  const location = useLocation();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const getValue = (name) => {
    const params = new URLSearchParams(location.search);
    if (params.get(name)) {
      return params.get(name);
    } else {
      return '';
    }
  };

  // https://stackoverflow.com/questions/53819864/
  // how-to-async-await-in-react-render-function
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      const category = params.get('category');
      let request = '/v0/filters';
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
          return json;
        })
        .catch((err) => {
          if (err.status === 404) {
            alert('Category does not exist');
          } else {
            alert('Filters Server Error');
          }
          return [];
        });
      setData(disp);
    };
    getData();
  }, [location.search]);

  const filter = ({name, type, options}) => {
    return (
      <ListItem key={name}>
        {name + ':'}
        {type === 'enum' ? (
          <Select
            value={getValue(name)}
            label={name}
            name={name}
            onChange={handleInputChange}
          >
            {options.map(
              (option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ),
            )}
          </Select>
        ) : (type === 'range' ? (
          <div>
            <TextField
              label='Min'
              variant='standard'
              name={'MIN' + name}
              onChange={handleInputChange}
              sx={{width: '125px', marginLeft: '45px'}}/>
              to
            <TextField
              label='Max'
              variant='standard'
              name={'MAX' + name}
              onChange={handleInputChange}
              sx={{width: '125px'}}/>
          </div>
        ) : (
          <Checkbox
            name={name}
            onChange={handleInputChange}
          />
        )
        )}
      </ListItem>
    );
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleClickOpen = () => {
    setMobileOpen(true);
  };
  const handleClose = () => {
    setMobileOpen(false);
  };

  const mobileAllFilters = () => {
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
                Filters
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
          {data.map(filter)}
        </Dialog>
      </div>
    );
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          flexDirection: 'column',
          height: 100,
          display: {xs: 'block', sm: 'none'},
        }}
      >
        <ListItemText sx={{mt: -1}}>
          <Typography variant='h5'>Shop by Filters</Typography>
        </ListItemText>
        {/* Mobile View */}
        <Stack
          direction='row'
          spacing={1}
          variant='temporary'
          open={mobileOpen}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
            'mt': 1.5,
          }}
        >
          {/* location filter goes here when ready */}
          <Chip
            label={'All Filters'}
            onClick={handleClickOpen}
          />
        </Stack>
      </Paper>
      {mobileOpen && mobileAllFilters()}
    </Grid>
  );
}

export default MobileFilters;
