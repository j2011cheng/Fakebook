import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import {useHistory, useLocation} from 'react-router-dom';

/**
 * Primary filter
 *
 * @return {object} JSX
 */
function Categories() {
  const history = useHistory();
  const location = useLocation();
  const setCategory = (id) => {
    return () => {
      let params = new URLSearchParams(location.search);
      const category = params.get('category');
      params = new URLSearchParams();
      params.set('category', category);
      if (params.get('category') === id) {
        params.delete('category');
      } else {
        params.set('category', id);
      }
      history.push(`/?${params.toString()}`);
    };
  };

  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const request = '/v0/category';
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
            alert('Categories Server Error');
          }
          return [];
        });
      setData(disp);
    };
    getData();
  }, []);

  const category = ({name, id}) => {
    return (
      <ListItemButton
        key={id}
        onClick={setCategory(id)}
        sx={{
          width: '100%',
          ml: 2,
        }}
      >
        {name}
      </ListItemButton>
    );
  };

  return (
    <List
      name='categories'
      component='nav'
    >
      {width > 600 ?
        <Typography
          variant='h5'
          sx={{
            mt: 1,
            ml: 2,
          }}
        >
          Categories
        </Typography> :
        ''}
      {data.subcategories ? data.subcategories.map(category) : ''}
    </List>
  );
}

export default Categories;
