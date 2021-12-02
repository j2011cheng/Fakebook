import React from 'react';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useHistory, useLocation} from 'react-router-dom';

/**
 * Category chips section of body
 *
 * @return {object} JSX
 */
function Subcategories() {
  // --- Mobile ---
  // breadcrumbs
  // category selection (dropdown)
  // subcategory selection (chips)
  // search bar
  // location filter
  // category specific filters

  // --- Desktop ---
  // Shop by category text
  // category chips

  const location = useLocation();

  const history = useHistory();
  const setCategory = (id) => {
    return () => {
      const params = new URLSearchParams(location.search);
      params.set('category', id);
      history.push(`/listings?${params.toString()}`);
    };
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
        <Stack direction='row' spacing={1}>
          {data.map(subcategory)}
        </Stack>
      </Paper>
    </Grid>
  );
};

export default Subcategories;
