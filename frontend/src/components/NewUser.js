import React from 'react';
import {useHistory} from 'react-router-dom';

/**
 * @return {object} JSX
 */
function NewUser() {
  const [user, setUser] = React.useState({name: '', email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    history.push('/login');
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 id='welcome'>Welcome to fakebook</h2>
      <input
        type='text'
        name='name'
        placeholder='Name'
        onChange={handleInputChange}
        required
      />
      <input
        type='text'
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
  );
}

export default NewUser;
