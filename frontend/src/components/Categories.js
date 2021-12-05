import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
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
      <ListItem
        key={id}
      >
        <Button
          onClick={setCategory(id)}
          variant='contained'
          sx={{
            width: '100%',
            height: 50,
          }}
        >
          {name}
        </Button>
      </ListItem>
    );
  };

  return (
    <List
      name='categories'
      sx={{
        width: '100%',
      }}
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
