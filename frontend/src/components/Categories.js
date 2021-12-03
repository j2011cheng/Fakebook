import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
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
      <ListItem key={id}>
        <Button
          value={id}
          onClick={setCategory(id)}
        >
          {name}
        </Button>
      </ListItem>
    );
  };

  return (
    <List name='categories'>
      {data.subcategories ? data.subcategories.map(category) : ''}
    </List>
  );
}

export default Categories;
