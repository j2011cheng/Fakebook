import React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
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
  const [filters, setFilters] = React.useState();

  // https://stackoverflow.com/questions/53819864/
  // how-to-async-await-in-react-render-function
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const getData = async () => {
      const disp = await fetch(`/v0/filters?category=${location.pathname}`, {
        method: 'GET',
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          return (
            <List>
              {json.map(filter)}
            </List>
          );
        })
        .catch((err) => {
          if (err.status === 404) {
            alert('Category does not exist');
          } else {
            alert('Server Error');
          }
          return (<div>Error</div>);
        });
      setData(disp);
    };
    getData();
  }, []);

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const f = filters;
    f[name] = value;
    setFilters(f);
  };

  const applyFilters = () => {
    let q = location.pathname + '?';
    for (const filter in filters) {
      if (filters[filter]) {
        q += `${filter}=${filters[filter]}`;
      }
    }
    history.push(q);
  };

  const filter = ({name, type, options}) => {
    return (
      <ListItem>
        <ListItemText
          primary={name + ':'}
          secondary={type === 'enum' ? (
            <Select
              value={name}
              label={name}
              onChange={handleInputChange}
            >
              {options.map(
                (option) => (
                  <MenuItem
                    value={option}
                    key={option}
                  >
                  </MenuItem>
                ),
              )}
            </Select>
          ) : (type === 'range' ? (
            <div>
              <TextField
                label='Min'
                variant='standard'
                name={name + 'Min'}
                sx={{width: '125px', marginLeft: '45px'}}/>
                to
              <TextField
                label='Max'
                variant='standard'
                name={name + 'Max'}
                sx={{width: '125px'}}/>
            </div>
          ) : (
            <Checkbox
              onChange={handleInputChange}
            />
          )
          )}
        />
      </ListItem>
    );
  };

  return (
    <div>
      <h1>Filters</h1>
      <Button
        name='apply'
        value='Apply'
        fullWidth
        onClick={applyFilters}
      />
      {data ? data : (<div>Loading</div>)}
    </div>
  );
}

export default Filters;
