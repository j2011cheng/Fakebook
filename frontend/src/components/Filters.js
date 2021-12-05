import React from 'react';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useHistory, useLocation} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import Distance from './Distance';

/**
 * Filters list
 * Populate data based on category selected
 *
 * @return {object} JSX
 */
function Filters() {
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
      <ListItem
        display='flex'
        flexDirection='row'
        key={name}
      >
        <Box
          sx={{
            minWidth: '30%',
          }}
        >
          {name + ':'}
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          {type === 'enum' ? (
            <FormControl
              key = {name}
              sx={{
                width: '100%',
              }}
            >
              <InputLabel id='category-select'>{name}</InputLabel>
              <Select
                value={getValue(name)}
                label={name}
                name={name}
                defaultValue={name}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
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
            </FormControl>
          ) : (type === 'range' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <TextField
                label='Min'
                size='small'
                name={'MIN' + name}
                onChange={handleInputChange}
              />
              <TextField
                variant='standard'
                defaultValue='to'
                sx={{
                  mt: 1,
                  width: 50,
                  ml: 1,
                  mr: 1,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label='Max'
                size='small'
                name={'MAX' + name}
                onChange={handleInputChange}
              />
            </Box>
          ) : (
            <Checkbox
              name={name}
              onChange={handleInputChange}
            />
          )
          )}
        </Box>
      </ListItem>
    );
  };

  return (
    <div>
      {window.innerWidth > 600 ?
        <Typography
          variant='h5'
          sx={{
            mt: 1,
            ml: 2,
          }}
        >
          Filters
        </Typography> :
        ''}
      <List>
        <Distance/>
        {data.map(filter)}
      </List>
    </div>
  );
}

export default Filters;
