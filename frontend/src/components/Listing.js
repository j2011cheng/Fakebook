import React from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import {useLocation, useHistory} from 'react-router-dom';

import Responses from './Responses';

/**
 *
 * @return {object} JSX
 */
function Listing() {
  const location = useLocation();
  const history = useHistory();
  const [image, setImage] = React.useState(1);

  const [listing, setListing] = React.useState();
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      setListing(params.get('listing'));
    };
    getData();
  }, [location.search]);

  const handleChange = (event, value) => {
    setImage(value);
  };

  const [data, setData] = React.useState({});
  React.useEffect(() => {
    const getData = async () => {
      if (!listing) {
        return {};
      }
      const request = `/v0/listing/${listing}`;
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
            alert('Listing does not exist');
          } else {
            alert('Listing Server Error');
          }
          return {};
        });
      setData(disp);
    };
    getData();
  }, [listing]);

  const attributeItems = () => {
    const attributes = [];
    for (const key in data.attributes) {
      if (data.attributes.hasOwnProperty(key) && key !== '') {
        attributes.push((
          <Grid item xs={6} key={key}>
            {`${key}: ${data.attributes[key]}`}
          </Grid>
        ));
      }
    }
    return attributes;
  };

  if (!listing) {
    return (<div></div>);
  }

  const handleClose = () => {
    const params = new URLSearchParams(location.search);
    params.delete('listing');
    history.push(`/?${params.toString()}`);
  };

  return (
    <Dialog
      fullScreen
      onClose={handleClose}
      open
      scroll={'paper'}
    >
      <DialogTitle sx={{position: 'relative'}}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={handleClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
            {data.name}
          </Typography>
        </Toolbar>
      </DialogTitle>
      <DialogContent>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              m: 3,
              width: '60%',
              maxHeight: '60%',
            }}
          >
            <img
              src={data.images ? data.images[image-1] : ''}
              alt='Not found'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src='/not-found-image.jpg';
              }}
              width='100%'
              height='100%'
            />
          </Box>
          <Pagination
            count={data.images ? data.images.length : 0}
            page={image}
            onChange={handleChange}
          />
          <Box
            sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {data.name ? data.name : ''}
              </Grid>
              <Grid item xs={6}>
                {data.owner && data.owner.name ? data.owner.name : ''}
              </Grid>
              <Grid item xs={12}>
                {data.description}
              </Grid>
              {attributeItems()}
              <Grid item xs={12}>
                <Responses/>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Listing;
