import React from 'react';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import {useHistory, useLocation} from 'react-router-dom';

// const DEFAULT_IMAGE = '%PUBLIC_URL%/not-found-image.jpg';

/**
 *
 * @return {object} JSX
 */
function ListingList() {
  const history = useHistory();
  const location = useLocation();

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const path = location.pathname.split('?')[0].split('/');
      const category = path[path.length - 1];
      let request = '/v0/listings';
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
            alert('Server Error');
          }
          return [];
        });
      setData(disp);
    };
    getData();
  }, [location.pathname]);

  const listingClick = (event) => {
    const listing = event.currentTarget.id;
    history.push(`/listing/${listing}`);
  };

  const listItem = ({id, image, price, name}) => {
    return (
      <Button
        id={id}
        key={id}
        onClick={listingClick}
      >
      <ImageListItem
      >
        <img
          src={image}
          alt='Not found'/>
        <ImageListItemBar
          title={name}
          subtitle={`$${price}`}
          position="below"
        />
      </ImageListItem>
      </Button>
    );
  };

  return (
    <ImageList name='listings'>
      {data.length ? data.map(listItem) : ''}
    </ImageList>
  );
};

export default ListingList;
