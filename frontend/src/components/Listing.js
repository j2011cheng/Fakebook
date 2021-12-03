import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {useLocation} from 'react-router-dom';


/**
 *
 * @return {object} JSX
 */
function Listing() {
  const [message, setMessage] = React.useState('');
  const location = useLocation();
  const [image, setImage] = React.useState(1);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleChange = (event, value) => {
    setImage(value);
  };

  const [data, setData] = React.useState({});
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
          return {};
        });
      setData(disp);
    };
    getData();
  }, [location.search]);

  const [responses, setResponses] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      const user = localStorage.getItem('user') ?
        JSON.parse(localStorage.getItem('user')) : undefined;
      if (user) {
        const request =
          `/v0/response/${user.owner.id}?listing=${params.get('listing')}`;
        const bearerToken = user.accessToken;
        const disp = await fetch(request, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
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
            if (err.status !== 404) {
              alert('Responses Server Error');
            }
            return [];
          });
        setResponses(disp);
      }
    };
    getData();
  }, [location.search, message]);

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

  const submitResponse = () => {
    const params = new URLSearchParams(location.search);
    const user = JSON.parse(localStorage.getItem('user'));
    const request =
      `/v0/response/${params.get('listing')}`;
    const bearerToken = user.accessToken;
    const body = JSON.stringify({
      message: message,
    });
    fetch(request, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
      body: body,
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          alert('Login session expired');
        } else {
          alert('New Response Server Error');
        }
      });
    setMessage('');
  };

  const responseItems = () => {
    const items = [];
    if (data.name && localStorage.getItem('user')) {
      items.push((
        <Grid item xs={8} key='text'>
          <TextareaAutosize
            value={message}
            placeholder='Response'
            onInput={handleInputChange}
          />
        </Grid>
      ));
      items.push((
        <Grid item xs={4} key='submit'>
          <Button
            onClick={submitResponse}
          >
            Respond
          </Button>
        </Grid>
      ));
      if (JSON.parse(localStorage.getItem('user')).owner.id === data.owner.id) {
        for (let i = 0; i < responses.length; i++) {
          items.push((
            <Grid item xs={12} key={i}>
              {responses[i]}
            </Grid>
          ));
        }
      }
      return items;
    } else {
      return;
    }
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
          <Grid container justifyContent='flex-end'>
            {responseItems()}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Listing;
