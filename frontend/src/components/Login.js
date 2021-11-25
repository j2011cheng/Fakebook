import React from 'react';
import {useHistory} from 'react-router-dom';

/**
 * @return {object} JSX
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/v0/authenticate', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
        alert('Error logging in, please try again');
      });
  };

  const onNewClick = (event) => {
    history.push('/newuser');
  };

  return (
    <div>
      <h2 id='welcome'>fakebook</h2>
      <form onSubmit={onSubmit}>
        <input
          type='email'
          name='email'
          placeholder='Email'
          onChange={handleInputChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleInputChange}
          required
        />
        <input type='submit' value='Submit'/>
      </form>
      <button onClick={onNewClick}>Create new account</button>
    </div>
  );
}

export default Login;
