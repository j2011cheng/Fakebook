import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useLocation} from 'react-router-dom';

/**
 *
 * @return {object} JSX
 */
function Responses() {
  const [message, setMessage] = React.useState('');
  const location = useLocation();

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const [listing, setListing] = React.useState();
  React.useEffect(() => {
    const getData = async () => {
      const params = new URLSearchParams(location.search);
      setListing(params.get('listing'));
    };
    getData();
  }, [location.search]);

  const [responses, setResponses] = React.useState([]);
  React.useEffect(() => {
    const getData = async () => {
      const user = localStorage.getItem('user') ?
        JSON.parse(localStorage.getItem('user')) : undefined;
      if (user && listing) {
        const request =
          `/v0/response/${user.owner.id}?listing=${listing}`;
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
  }, [message, listing]);

  const submitResponse = () => {
    if (message) {
      const params = new URLSearchParams(location.search);
      const user = JSON.parse(localStorage.getItem('user'));
      const request =
        `/v0/response/${params.get('listing')}`;
      const bearerToken = user.accessToken;
      console.log(user.owner.id);
      const body = JSON.stringify({
        message: message,
        owner: user.owner.id,
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
    }
  };

  const responseItems = () => {
    const items = [];
    if (localStorage.getItem('user')) {
      items.push((
        <Grid item xs={12} key='text'>
          <TextField
            value={message}
            onInput={handleInputChange}
            placeholder='Response'
            multiline
            rows={4}
            overflow='auto'
            fullWidth
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
      for (let i = 0; i < responses.length; i++) {
        items.push((
          <Grid container>
            <Grid item xs={4} key={i + responses[i].owner}>
              {responses[i].owner}
            </Grid>
            <Grid item xs={8} key={i + responses[i].owner}>
              {responses[i].message}
            </Grid>
          </Grid>
        ));
      }
      return items;
    } else {
      return;
    }
  };

  return (
    <div>
      {responseItems()}
    </div>
  );
};

export default Responses;
