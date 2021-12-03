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

  return (
    <div>
      <h1>
        Filters
      </h1>
      <List>
        {data.map(filter)}
      </List>
    </div>
  );
}

export default Filters;
