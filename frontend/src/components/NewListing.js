import React from 'react';
import {useHistory} from 'react-router-dom';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';

/**
 * @return {object} JSX
 */
function NewListing() {
  const owner = JSON.parse(localStorage.getItem('user')).owner;
  let loaded = false;
  const [category, setCategory] = React.useState();
  const [listing, setListing] =
    React.useState({
      category: '',
      owner: owner,
      attributes: {},
      name: '',
      price: 0.0,
      description: '',
      images: [],
    });
  const history = useHistory();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const l = listing;
    if (name === 'images') {
      const imgs = value.split('\n');
      l.images = imgs;
    } else {
      l[name] = name === 'price' ? Number(value) : value;
    }
    setListing(l);
  };

  const handleFilterChange = (event) => {
    const target = event.target;
    let value;
    switch (target.type) {
    case 'checkbox':
      value = target.checked;
      break;
    case 'number':
      value = Number(target.value);
      break;
    default:
      value = target.value;
      break;
    }
    const name = target.name;
    const params = listing.attributes;
    if (value) {
      params[name]=value;
    } else {
      delete params[name];
    }
    const l = listing;
    l.attributes = params;
    setListing(l);
  };

  const onSubmit = (event) => {
    const l = listing;
    const token = JSON.parse(localStorage.getItem('user')).accessToken;
    l.category = categoryList.find((c) => c.id === category);
    setListing(l);
    event.preventDefault();
    fetch('/v0/listing', {
      method: 'POST',
      body: JSON.stringify(listing),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw res;
      }
      history.push('/');
    })
      .catch((err) => {
        if (err.status === 400) {
          alert('Bad Listing');
        } else {
          alert('New Listing Server Error');
        }
        return [];
      });
  };

  const [filters, setFilters] = React.useState([]);
  React.useEffect(() => {
    const getFilters = async () => {
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
      setFilters(disp);
    };
    getFilters();
  }, [category]);

  const [categoryList, setCategoryList] = React.useState([]);
  React.useEffect(() => {
    const getCategories = async () => {
      const list = await fetch('/v0/categories', {
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
            alert('Categories Not Found');
          } else {
            alert('Categories Server Error');
          }
          return [];
        });
      setCategoryList(list);
    };
    getCategories();
    loaded = true;
  }, [loaded]);


  const categories = (cat) => {
    return (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.name}
      </MenuItem>
    );
  };

  const filter = ({name, type, options}) => {
    if (name === 'price') {
      return;
    }
    return (
      type === 'enum' ? (
        <FormControl key = {name} sx={{width: '125px'}}>
          <InputLabel id='category-select'>{name}</InputLabel>
          <Select
            label={name}
            name={name}
            value={listing.attributes[name]}
            onChange={handleFilterChange}
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
        <TextField
          key={name}
          label={name}
          name={name}
          placeholder={name}
          type='number'
          onChange={handleFilterChange}
          sx={{width: '125px'}}
        />
      ) : (
        <div
          key={name}
        >
          {name+': '}
          <Checkbox
            label={name}
            name={name}
            onChange={handleFilterChange}
          />
        </div>)
      )
    );
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Listing
        </Typography>
        <Box component="form"
          sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel id="category-select">Category</InputLabel>
                <Select
                  name="category"
                  id="category-select"
                  placeholder="Category"
                  value={category ? category : ''}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categoryList.map(categories)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='text'
                name='name'
                label="Name"
                placeholder='Name'
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='number'
                label="Price"
                name='price'
                placeholder='0.00'
                onChange={handleInputChange}
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start">
                      $
                    </InputAdornment>,
                }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <div>
                {filters.map(filter)}
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='text'
                label="Description"
                name='description'
                placeholder='Description'
                onChange={handleInputChange}
                multiline
                maxRows={4}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="images"
                label="Images"
                multiline
                rows={4}
                fullWidth
                placeholder="image1&#10;image2&#10;image3"
                onChange={handleInputChange}
                variant="standard"
              />
            </Grid>
          </Grid>
          <div>
            <Button
              type="submit"
              value="Cancel"
              fullWidth
              sx={{mt: 3, mb: 2}}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              value="Create"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
              onClick={onSubmit}
            >
              Create
            </Button>
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default NewListing;
