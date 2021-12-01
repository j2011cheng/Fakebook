import React from 'react';
import Button from '@mui/material/Button';
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
  const [filters, setFilters] = React.useState({});

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log(name, value);
    const f = filters;
    f[name] = value;
    setFilters(f);
  };

  // https://stackoverflow.com/questions/53819864/
  // how-to-async-await-in-react-render-function
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const path = location.pathname.split('?')[0].split('/');
      const category = path[path.length - 1];
      const request = '/v0/filters' + (category ? `?category=${category}` : '');
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
            alert('Server Error');
          }
          return undefined;
        });
      console.log(disp);
      setData(disp);
    };
    getData();
  }, [location]);

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
    console.log(name, type, options);
    return (
      <ListItem key={name}>
        {name + ':'}
        {type === 'enum' ? (
          <Select
            value={filters[name] ? filters[name] : ''}
            label={name}
            onChange={(event) => handleInputChange({
              name: name,
              value: event.target.value,
            })}
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
        <Button
          name='apply'
          onClick={applyFilters}
        >
          Apply
        </Button>
      </h1>
      <List>
        {data.map(filter)}
      </List>
    </div>
  );
}

export default Filters;
