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
      const params = new URLSearchParams(location.search);
      let request = '/v0/listings';
      if (params.toString()) {
        request += `?${params.toString().replace(/\+/g, '%20')}`;
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
            alert('Listings Server Error');
          }
          return [];
        });
      setData(disp);
    };
    getData();
  }, [location.search]);

  const listingClick = (event) => {
    const listing = event.currentTarget.id;
    history.push(`/listing?listing=${listing}`);
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
            alt='Not found'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src='/not-found-image.jpg';
            }}
          />
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
