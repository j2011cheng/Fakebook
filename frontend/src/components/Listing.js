import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import {useLocation} from 'react-router-dom';


/**
 *
 * @return {object} JSX
 */
function Listing() {
  const location = useLocation();
  const [image, setImage] = React.useState(1);

  const handleChange = (event, value) => {
    setImage(value);
  };

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      const request = `/v0/listing/${params.get('listing')}`;
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
          return [];
        });
      setData(disp);
    };
    getData();
  }, [location.search]);

  const attributeItems = () => {
    const attributes = [];
    for (const key in data.attributes) {
      if (data.attributes.hasOwnProperty(key) && key != '') {
        attributes.push((
          <Grid item xs={6} key={key}>
            {`${key}: ${data.attributes[key]}`}
          </Grid>
        ));
      }
    }
    return attributes;
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
          {data.name}
        </Typography>
        <img
          src={data.images ? data.images[image-1] : ''}
          alt='Not found'
        />
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
          </Grid>
          {/* <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='' variant='body2' onClick={signIn}>
                Already have an account?
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Listing;
