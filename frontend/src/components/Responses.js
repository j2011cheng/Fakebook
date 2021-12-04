import React from 'react';
import Grid from '@mui/material/Grid';
import TextareaAutosize from '@mui/material/TextareaAutosize';
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
    if (localStorage.getItem('user')) {
      items.push((
        <Grid item xs={8} key='text'>
          <TextareaAutosize
            value={message}
            onInput={handleInputChange}
            placeholder='Response'
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
      // if (JSON.parse(localStorage.getItem('user')).owner.id
      // === data.owner.id) {
        for (let i = 0; i < responses.length; i++) {
          items.push((
            <Grid item xs={12} key={i}>
              {responses[i]}
            </Grid>
          ));
        }
      // }
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
