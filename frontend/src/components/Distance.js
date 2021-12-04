import React from 'react';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import {useLocation, useHistory} from 'react-router-dom';
/**
 *
 * @return {object} JSX
 */
function Distance() {
  const history = useHistory();
  const url = useLocation();

  const [distance, setDistance] = React.useState('');
  const [[lat, long], setLocation] = React.useState([
    new URLSearchParams(url.search).get('lat'),
    new URLSearchParams(url.search).get('long'),
  ]);
  const [locationWatch, setLocationWatch] = React.useState(0);

  const enableLocation = () => {
    if (!locationWatch) {
      const handlePosition = (pos) => {
        const crd = pos.coords;
        if (!lat || !long) {
          setLocation([crd.latitude, crd.longitude]);
        }
      };
      const handleErr = (err) => {
        console.warn(`Location error (${err.code}): ${err.message}`);
      };
      const options = {
        magimumAge: Infinity,
        timeout: 5000,
      };
      setLocationWatch(navigator.geolocation.watchPosition(
        handlePosition,
        handleErr,
        options,
      ));
    }
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const params = new URLSearchParams(url.search);
    if (value) {
      setDistance(value);
      params.set('distance', value);
      if (lat && long) {
        params.set('lat', lat);
        params.set('long', long);
      }
    } else {
      setDistance('');
      params.delete('distance');
    }
    history.push(`${url.pathname}?${params.toString()}`);
  };

  return (
    <ListItem>
      {'Distance:'}
      <TextField
        onInput={handleInputChange}
        onFocus={enableLocation}
        value={distance}
        name='distance'
        label='km'
      />
    </ListItem>
  );
};

export default Distance;
