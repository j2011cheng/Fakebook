import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';

/**
 * Primary filter
 *
 * @return {object} JSX
 */
function Categories() {
  const history = useHistory();
  const setCategory = (event) => {
    history.push(`/${event.target.value}`);
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
            alert('Server Error');
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
          onClick={setCategory}
        >
          {name}
        </Button>
      </ListItem>
    );
  };

  return (
    <div>
      <h1>
        Categories
      </h1>
      <List name='categories'>
        {data.subcategories ? data.subcategories.map(category) : ''}
      </List>
    </div>
  );
}

export default Categories;
